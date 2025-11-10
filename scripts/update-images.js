// Script to update product images in database
// Run with: node scripts/update-images.js

const { PrismaClient } = require('../@prisma/client
');
const prisma = new PrismaClient();

const imageUpdates = [
  {
    description: 'Brown 5-Ply Universal Boxes',
    imageUrl: '/images/universal_box_brown_5ply.jpg',
    conditions: [
      { name: { contains: '5-Ply Universal', mode: 'insensitive' } },
      { name: { contains: 'Brown 5-Ply', mode: 'insensitive' } },
    ]
  },
  {
    description: 'Pizza Box Style',
    imageUrl: '/images/pizza_box_style.jpg',
    conditions: [
      { name: { contains: 'Pizza Box', mode: 'insensitive' } },
      { category: 'Pizza Boxes' },
    ]
  },
  {
    description: 'Custom Branded Tape',
    imageUrl: '/images/custom_branded_tape.jpg',
    conditions: [
      { name: { contains: 'Custom Printed', mode: 'insensitive' } },
      { name: { contains: 'Branded Tape', mode: 'insensitive' } },
      { name: { contains: 'Custom Tape', mode: 'insensitive' } },
    ]
  },
  {
    description: 'Thermocol JAR Packaging',
    imageUrl: '/images/thermocol_jar_packaging.jpg',
    conditions: [
      { 
        AND: [
          { name: { contains: 'Thermocol', mode: 'insensitive' } },
          { name: { contains: 'JAR', mode: 'insensitive' } }
        ]
      },
    ]
  },
  {
    description: 'EPE Foam JAR Packaging',
    imageUrl: '/images/epe_foam_jar_packaging.jpg',
    conditions: [
      { 
        AND: [
          { name: { contains: 'EPE', mode: 'insensitive' } },
          { name: { contains: 'JAR', mode: 'insensitive' } }
        ]
      },
    ]
  },
];

async function updateProductImages() {
  console.log('🔄 Starting product image updates...\n');

  let totalUpdated = 0;

  for (const update of imageUpdates) {
    console.log(`📦 Updating: ${update.description}`);
    
    // Try each condition
    for (const condition of update.conditions) {
      try {
        const result = await prisma.product.updateMany({
          where: condition,
          data: {
            imageUrl: update.imageUrl,
          },
        });

        if (result.count > 0) {
          console.log(`   ✅ Updated ${result.count} product(s)`);
          totalUpdated += result.count;
        }
      } catch (error) {
        console.error(`   ❌ Error with condition:`, error.message);
      }
    }
    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log(`✅ Total products updated: ${totalUpdated}`);
  console.log('═══════════════════════════════════════\n');

  // Show updated products
  console.log('📋 Updated products:');
  const updatedProducts = await prisma.product.findMany({
    where: {
      imageUrl: {
        in: imageUpdates.map(u => u.imageUrl),
      },
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
  });

  updatedProducts.forEach(product => {
    console.log(`   - ${product.name}`);
    console.log(`     Image: ${product.imageUrl}\n`);
  });
}

// Run the update
updateProductImages()
  .then(() => {
    console.log('✅ Image update completed successfully!');
    console.log('🚀 Restart your dev server: npm run dev\n');
  })
  .catch((error) => {
    console.error('❌ Error updating images:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
