# Automatic Migration Guide

This guide explains how to use the automatic migration system for the Image PDF Analyzer backend.

## 🚀 Quick Start

### First Time Setup
```bash
# Start PostgreSQL
docker-compose up -d

# Setup database with automatic initial migration
npm run setup-db

# Start development server
npm run dev
```

## 🔄 Automatic Migration Workflow

### 1. Modify Your Entities
Edit your entity files in `src/entities/` (e.g., add new fields, change column types, etc.)

### 2. Generate Migration Automatically
```bash
npm run migration:generate -- YourMigrationName
```

This will:
- Compare your current entities with the database schema
- Automatically generate the migration file
- Create the appropriate SQL commands

### 3. Review Generated Migration
Check the generated file in `src/migrations/` before running it

### 4. Apply Migration
```bash
npm run migration:run
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup-db` | Complete database setup with initial migration |
| `npm run migration:generate -- Name` | Generate migration from entity changes |
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run migration:show` | Show migration status |
| `npm run migration:create -- Name` | Create empty migration file |

## 🎯 Migration Rules

### ✅ What Gets Auto-Generated
- **New tables** from new entities
- **New columns** from new entity properties
- **Column type changes** from property type changes
- **Indexes** from `@Index()` decorators
- **Foreign keys** from `@ManyToOne`, `@OneToMany` relationships
- **Unique constraints** from `@Column({ unique: true })`

### ⚠️ Manual Review Required
- **Data transformations** (you may need to add custom SQL)
- **Complex constraints** not expressible in decorators
- **Data migrations** (moving/transforming existing data)

## 📝 Example Workflow

### Adding a New Field to User Entity

1. **Edit Entity** (`src/entities/User.ts`):
```typescript
@Entity('users')
export class User {
  // ... existing fields ...
  
  @Column({ nullable: true })
  lastLoginAt?: Date; // New field
}
```

2. **Generate Migration**:
```bash
npm run migration:generate -- AddLastLoginToUser
```

3. **Review Generated Migration** (`src/migrations/xxx-AddLastLoginToUser.ts`):
```typescript
export class AddLastLoginToUser1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "lastLoginAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLoginAt"`);
  }
}
```

4. **Apply Migration**:
```bash
npm run migration:run
```

## 🔧 Advanced Usage

### Custom Migration (when auto-generation isn't enough)
```bash
npm run migration:create -- CustomDataMigration
```

Then edit the generated file to add custom SQL:
```typescript
export class CustomDataMigration1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Custom SQL here
    await queryRunner.query(`UPDATE users SET status = 'active' WHERE status IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback SQL here
    await queryRunner.query(`UPDATE users SET status = NULL WHERE status = 'active'`);
  }
}
```

## 🚨 Best Practices

1. **Always review** generated migrations before running
2. **Test migrations** on development database first
3. **Backup production** before running migrations
4. **Use descriptive names** for migrations
5. **Keep migrations small** and focused
6. **Never edit** existing migration files (create new ones instead)

## 🐛 Troubleshooting

### Migration Generation Fails
- Ensure database is running: `docker-compose up -d`
- Check entity syntax and decorators
- Verify database connection in `.env`

### Migration Run Fails
- Check migration file syntax
- Ensure no conflicting changes
- Use `npm run migration:revert` to undo if needed

### Database Out of Sync
- Use `npm run migration:show` to check status
- Run `npm run setup-db` to reset and regenerate
