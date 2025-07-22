const products = [
    {
        name: 'Automatic Powder Fire Extinguisher',
        description: 'Advanced automatic powder fire extinguisher with quick response',
        longDescription: 'This automatic powder fire extinguisher is designed for quick response in emergencies. It features a reliable activation mechanism and is effective against Class A, B, C fires and electrical fires.',
        price: 199.99,
        category: 'Powder Extinguishers',
        subcategory: 'Automatic',
        images: ['automatic-powder-fire-extinguisher.png'],
        stockStatus: 'in-stock',
        certifications: 'BS EN3 Certified',
        specifications: 'Capacity: 2kg, Operating Temperature: -20°C to +60°C, Weight: 2.5kg',
        stock: 50
    },
    {
        name: 'CO2 Fire Extinguisher',
        description: 'Professional CO2 fire extinguisher for electrical fires',
        longDescription: 'This CO2 fire extinguisher is perfect for electrical fires and flammable liquids. It leaves no residue and is safe for electronic equipment.',
        price: 149.99,
        category: 'CO2 Extinguishers',
        subcategory: 'Standard',
        images: ['Co2-fire-extinguisher.png'],
        stockStatus: 'in-stock',
        certifications: 'BS EN3 Certified',
        specifications: 'Capacity: 2kg, Operating Temperature: -20°C to +60°C, Weight: 2.2kg',
        stock: 40
    },
    {
        name: 'Foam Fire Extinguisher',
        description: 'Foam fire extinguisher with cooling effect',
        longDescription: 'This foam fire extinguisher provides excellent cooling and fire suppression capabilities. It forms a stable foam blanket to prevent re-ignition.',
        price: 129.99,
        category: 'Foam Extinguishers',
        subcategory: 'Standard',
        images: ['foam-extinguisher.png'],
        stockStatus: 'in-stock',
        certifications: 'BS EN3 Certified',
        specifications: 'Capacity: 2L, Operating Temperature: -20°C to +60°C, Weight: 2.8kg',
        stock: 60
    },
    {
        name: 'Fire Hose Cabinet',
        description: 'Complete fire hose cabinet system',
        longDescription: 'This wall-mounted fire hose cabinet provides complete fire protection with easy access to fire hose reels.',
        price: 299.99,
        category: 'Storage Solutions',
        subcategory: 'Cabinet',
        images: ['Fire-Hose-Reel-Fire-Hose-Cabinet.png'],
        stockStatus: 'in-stock',
        certifications: 'BS EN690 Certified',
        specifications: 'Dimensions: 1200x600x200mm, Material: Steel, Weight: 15kg',
        stock: 30
    },
    {
        name: 'Fire Safety Accessories Kit',
        description: 'Comprehensive fire safety accessories kit',
        longDescription: 'This kit includes all essential fire safety accessories for maintaining and using fire safety equipment effectively.',
        price: 99.99,
        category: 'Accessories',
        subcategory: 'Kit',
        images: ['accesories.jpg'],
        stockStatus: 'in-stock',
        certifications: 'BS EN3 Certified',
        specifications: 'Contents: Safety signs, maintenance tools, mounting brackets',
        stock: 75
    }
];

const populateProducts = async () => {
    try {
        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            throw new Error('Please set ADMIN_EMAIL and ADMIN_PASSWORD environment variables');
        }

        // Login with admin credentials
        const adminLogin = await fetch('https://fireequipement-7017f950b80c.herokuapp.com/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: adminEmail,
                password: adminPassword
            })
        });

        if (!adminLogin.ok) {
            throw new Error('Failed to login as admin');
        }

        const { token } = await adminLogin.json();

        // Now use the token for subsequent requests
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Clear existing products
        await fetch('https://fireequipement-7017f950b80c.herokuapp.com/api/products', {
            method: 'DELETE',
            headers: headers
        });

        // Get category IDs
        const categoriesResponse = await fetch('https://fireequipement-7017f950b80c.herokuapp.com/api/category/categories', {
            headers: headers
        });

        if (!categoriesResponse.ok) {
            throw new Error('Failed to fetch categories');
        }

        const categories = await categoriesResponse.json();
        const categoryMap = new Map(categories.map(cat => [cat.name, cat._id]));

        // Create new products
        for (const product of products) {
            await fetch('https://fireequipement-7017f950b80c.herokuapp.com/api/products', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    ...product,
                    category: categoryMap.get(product.category)
                })
            });
        }

        console.log('Products populated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error populating products:', error);
        process.exit(1);
    }
};

populateProducts();
