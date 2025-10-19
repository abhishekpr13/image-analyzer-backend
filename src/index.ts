import "reflect-metadata";
import express from "express"
import cors from "cors";
import multer from "multer";
import FileRoute from "./routes/fileRoutes";
import authrouter from "./routes/authRoutes";
import { authenticateToken, AuthRequest } from "./middleware/auth";
import { AppDataSource, initializeDatabase } from "./config/database";
import { File } from "./entities/File";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueName)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        if (allowedType.includes(file.mimetype)) {
            cb(null, true)
            console.log(`File is in acceptable format: ${file.mimetype}`)
        }
        else {
            const error = new Error('Invalid file type. Only images and PDFs allowed.');
            cb(error);
            console.log('Invalid file type attempted');
        }
    }
})

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

app.use(express.json())
app.use('/api/files', FileRoute)
app.use('/api/auth', authrouter)

app.get('/', (req, res) => {
    res.json({ message: "Image-PDF-Analyzer is running!" })
})

app.post('/api/upload', authenticateToken, upload.single('file'), async (req: AuthRequest, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: 'File not uploaded successfully'
        });
    }
    try {
        const fileRepository = AppDataSource.getRepository(File);
        const newFile = fileRepository.create({
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            userId: req.user.userId
        });

        await fileRepository.save(newFile);

        res.json({
            message: 'File uploaded successfully and saved to database!',
            fileId: newFile.id,
            originalName: newFile.originalName,
            size: newFile.fileSize
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to save to database' });
    }
});

const port = process.env.PORT || 8000;

// Initialize database and start server
const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
