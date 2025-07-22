const categories = [
    {
        name: 'Powder Extinguishers',
        description: 'Versatile fire extinguishers for Class A, B, C fires and electrical fires',
        image: 'powder.jpeg',
        slug: 1
    },
    {
        name: 'CO2 Extinguishers',
        description: 'Ideal for electrical fires and flammable liquids',
        image: 'CO2.jpg',
        slug: 2
    },
    {
        name: 'Foam Extinguishers',
        description: 'Effective for Class A and B fires',
        image: 'foam.jpg',
        slug: 3
    },
    {
        name: 'Accessories',
        description: 'Essential accessories for fire safety equipment',
        image: 'accesories.jpg',
        slug: 4
    },
    {
        name: 'Storage Solutions',
        description: 'Safe storage solutions for fire safety equipment',
        image: 'storage.jpg',
        slug: 5
    }
];

const populateCategories = async () => {
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

        // Clear existing categories
        await fetch('https://fireequipement-7017f950b80c.herokuapp.com/api/category/categories', {
            method: 'DELETE',
            headers: headers
        });

        // Create new categories
        for (const category of categories) {
            await fetch('https://fireequipement-7017f950b80c.herokuapp.com/api/category/categories', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(category)
            });
        }

        console.log('Categories populated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error populating categories:', error);
        process.exit(1);
    }
};

populateCategories();
