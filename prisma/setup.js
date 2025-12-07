const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  console.log('Setting up database...');

  await prisma.$transaction(
    async (tx) => {
      // Ensure the owner role exists
      const ownerRole = await tx.userRole.upsert({
        where: { slug: 'owner' },
        update: {}, // No updates needed, ensures idempotency
        create: {
          slug: 'owner',
          name: 'Owner',
          description: 'The default system role with full access.',
          isProtected: true,
          isDefault: false, // Optional: set to false if it's not the default role
        },
      });

      // Create the owner user
      const ownerPassword = await bcrypt.hash('123456', 10);
      const demoPassword = await bcrypt.hash('demo123', 10);

      const ownerUser = await tx.user.upsert({
        where: { email: 'owner@example.com' },
        update: {}, // No updates needed, ensures idempotency
        create: {
          email: 'owner@example.com',
          name: 'System Owner',
          password: ownerPassword,
          roleId: ownerRole.id,
          avatar: null, // Optional: Add avatar URL if available
          emailVerifiedAt: new Date(), // Optional: Mark email as verified
          status: 'ACTIVE',
        },
      });

      const demoUser = await tx.user.upsert({
        where: { email: 'demo@kt.com' },
        update: {}, // No updates needed, ensures idempotency
        create: {
          isProtected: true,
          email: 'demo@kt.com',
          name: 'Demo',
          password: demoPassword,
          roleId: ownerRole.id,
          avatar: null, // Optional: Add avatar URL if available
          emailVerifiedAt: new Date(), // Optional: Mark email as verified
          status: 'ACTIVE',
        },
      });

      // Seed UserRoles - Use upsert instead of create
      const defaultRole = await tx.userRole.upsert({
        where: { slug: 'member' },
        update: {}, // No updates needed
        create: {
          slug: 'member',
          name: 'Member',
          description: 'Default member role',
          isDefault: true,
          isProtected: true,
          createdAt: new Date(),
        },
      });

      // Check if system settings exist first
      const existingSettings = await tx.systemSetting.findFirst({
        where: {
          name: 'Metronic',
        },
      });

      // Only create if it doesn't exist
      if (!existingSettings) {
        await tx.systemSetting.create({
          data: {
            name: 'Metronic',
          },
        });
      }

      // ======================================================
      // Seed E-commerce Data
      // ======================================================
      console.log('Seeding e-commerce data...');

      // 1. Create Product Category
      const footwearCategory = await tx.productCategory.upsert({
        where: { slug: 'footwear' },
        update: {},
        create: {
          name: 'Footwear',
          slug: 'footwear',
        },
      });

      // 2. Create Products
      const classicKicks = await tx.product.upsert({
        where: { slug: 'classic-kicks' },
        update: {},
        create: {
          name: 'Classic Kicks',
          slug: 'classic-kicks',
          description: 'Timeless design meets modern comfort. Fully customizable.',
          price: 120.0,
          sku: 'CK-001',
          stockQuantity: 100,
          isPublished: true,
          categoryId: footwearCategory.id,
          isCustomizable: true,
          modelPath: '/models/shoes/classic_kicks.glb',
        },
      });

      const urbanRunner = await tx.product.upsert({
        where: { slug: 'urban-runner' },
        update: {},
        create: {
          name: 'Urban Runner',
          slug: 'urban-runner',
          description: 'Lightweight and stylish, perfect for the city. Fully customizable.',
          price: 150.0,
          sku: 'UR-002',
          stockQuantity: 80,
          isPublished: true,
          categoryId: footwearCategory.id,
          isCustomizable: true,
          modelPath: '/models/shoes/urban_runner.glb',
        },
      });

      const leatherBoots = await tx.product.upsert({
        where: { slug: 'leather-boots' },
        update: {},
        create: {
          name: 'Rugged Leather Boots',
          slug: 'leather-boots',
          description: 'Durable and stylish leather boots. Not available for customization.',
          price: 220.0,
          sku: 'LB-003',
          stockQuantity: 50,
          isPublished: true,
          categoryId: footwearCategory.id,
          isCustomizable: false, // This one is not customizable
        },
      });
      
      // 3. Create Customizable Parts for "Classic Kicks"
      await tx.customizablePart.createMany({
        data: [
          { productId: classicKicks.id, name: 'Upper', meshName: 'Upper', defaultColor: '#ffffff' },
          { productId: classicKicks.id, name: 'Sole', meshName: 'Sole', defaultColor: '#cccccc' },
          { productId: classicKicks.id, name: 'Laces', meshName: 'Laces', defaultColor: '#333333' },
          { productId: classicKicks.id, name: 'Swoosh', meshName: 'Swoosh', defaultColor: '#ff0000' },
        ],
        skipDuplicates: true,
      });

      // 4. Create Customizable Parts for "Urban Runner"
       await tx.customizablePart.createMany({
        data: [
          { productId: urbanRunner.id, name: 'Main Body', meshName: 'MainBody', defaultColor: '#f0f0f0' },
          { productId: urbanRunner.id, name: 'Outsole', meshName: 'Outsole', defaultColor: '#222222' },
          { productId: urbanRunner.id, name: 'Tongue', meshName: 'Tongue', defaultColor: '#555555' },
          { productId: urbanRunner.id, name: 'Heel Tab', meshName: 'HeelTab', defaultColor: '#007bff' },
        ],
        skipDuplicates: true,
      });
      
      // 5. Create Product Images
      await tx.productImage.createMany({
        data: [
          { productId: classicKicks.id, url: '/media/products/1.jpg', altText: 'Classic Kicks shoe', order: 1 },
          { productId: urbanRunner.id, url: '/media/products/2.jpg', altText: 'Urban Runner shoe', order: 1 },
          { productId: leatherBoots.id, url: '/media/products/3.jpg', altText: 'Rugged Leather Boots', order: 1 },
        ],
        skipDuplicates: true,
      });

      console.log('E-commerce data seeding completed!');

      console.log('Database setup completed!');
    },
    {
      timeout: 15000,
      maxWait: 15000,
    },
  );
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
