import express from "express";
import { AppDataSource } from "../config/database";
import { File } from "../entities/File";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import path from "path";

const router = express.Router()

router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const fileID = req.params.id;
        const fileRepository = AppDataSource.getRepository(File);
        const file = await fileRepository.findOne({
            where: {
                id: fileID,
                userId: req.user.userId
            }
        });
        if (!file) {
            return res.status(404).json({
                error: "File not found"
            })
        }
        res.json(file)
    } catch (error) {
        console.error('Get file error:', error);
        res.status(500).json({
            error: "Failed to retrieve the file"
        })
    }
})

router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const delete_id = req.params.id;
        const fileRepository = AppDataSource.getRepository(File);
        const file = await fileRepository.findOne({
            where: {
                id: delete_id,
                userId: req.user.userId
            }
        });

        if (!file) {
            return res.status(404).json({
                error: "File not found"
            })
        }
        await fileRepository.remove(file);
        res.json({
            message: "Successfully deleted",
            id: delete_id
        })
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            error: "Failed to delete"
        })
    }
})

router.get('/download/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const fileId = req.params.id;
        const fileRepository = AppDataSource.getRepository(File);
        const file = await fileRepository.findOne({
            where: {
                id: fileId,
                userId: req.user.userId
            }
        });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        const filePath = file.filePath;
        const absolutePath = path.resolve(filePath);
        res.sendFile(absolutePath);

    } catch (error) {
        console.error('Download file error:', error);
        res.status(500).json({
            error: "Failed to download file"
        })
    }
})

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const fileRepository = AppDataSource.getRepository(File);
        const files = await fileRepository.find({
            where: {
                userId: req.user.userId
            }
        });
        res.json({
            message: 'Files retrieved successfully',
            count: files.length,
            files: files
        });
    } catch (error) {
        console.error('Get files error:', error);
        return res.status(500).json({ error: "Failed to retrieve files" })
    }
})

export default router;