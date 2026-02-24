import { AppDataSource } from './data-source';
import { Auth } from '../auth/entity/auth.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
    console.log('🌱 Starting database seeding...');

    try {
        await AppDataSource.initialize();
        console.log('DataSource initialized');

        const authRepository = AppDataSource.getRepository(Auth);

        const email = 'admin@example.com';
        const password = 'password123';

        // Check if user already exists
        const existingUser = await authRepository.findOne({ where: { email } });

        if (existingUser) {
            console.log(`⚠️ User with email ${email} already exists. Skipping...`);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = authRepository.create({
                email,
                password: hashedPassword,
            });

            await authRepository.save(newUser);
            console.log(`✅ Admin user seeded successfully!`);
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 Password: ${password}`);
        }
    } catch (error) {
        console.error('❌ Error during seeding:', error);
    } finally {
        await AppDataSource.destroy();
        console.log('DataSource destroyed');
    }
}

seed();
