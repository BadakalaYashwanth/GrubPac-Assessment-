
const router = require('express').Router();

const { ensureauthenticated } = require('../Middlewares/Auth');

router.get('/', ensureauthenticated, (req, res) => {
    console.log("-----Login User Details-----", req.user);
    res.status(200).json([
        {
            name: "Google Pixel 10 Pro",
            price: 100000,
            description: "Google Pixel 10 is a smartphone with 100000mAh battery",
            image: "https://www.google.com/pixel10.jpg",
            category: "Smartphone",
            brand: "Google",
            rating: 4.5,
            numReviews: 100,
            countInStock: 10,
            reviews: [
                {
                    name: "John Doe",
                    rating: 4.5,
                    comment: "This is a great product",
                }
            ]
        },
        {
            name: "Apple iPhone 15 Pro Max",
            price: 150000,
            description: "Apple iPhone 15 Pro Max is a smartphone with 150000mAh battery",
            image: "https://www.apple.com/iphone15promax.jpg",
            category: "Smartphone",
            brand: "Apple",
            rating: 4.5,
            numReviews: 100,
            countInStock: 10,
            reviews: [
                {
                    name: "John Doe",
                    rating: 4.5,
                    comment: "This is a great product",
                }
            ]
        },
        {
            name: "Samsung Galaxy S24 Ultra",
            price: 120000,
            description: "Samsung Galaxy S24 Ultra is a smartphone with 120000mAh battery",
            image: "https://www.samsung.com/galaxy24ultra.jpg",
            category: "Smartphone",
            brand: "Samsung",
            rating: 4.5,
            numReviews: 100,
            countInStock: 10,
            reviews: [
                {
                    name: "John Doe",
                    rating: 4.5,
                    comment: "This is a great product",
                }
            ]
        }, 
        {
            name: "Acer Nitro 5",
            price: 100000,
            description: "Acer Nitro 5 is a laptop with 100000mAh battery",
            image: "https://www.acer.com/nitro5.jpg",
            category: "Laptop",
            brand: "Acer",
            rating: 4.5,
            numReviews: 100,
            countInStock: 10,
            reviews: [
                {
                    name: "John Doe",
                    rating: 4.5,
                    comment: "This is a great product",
                }
            ]
        },

        {
            name: "Dell Vostro 3400",
            price: 100000,
            description: "Dell Vostro 3400 is a laptop with 100000mAh battery",
            image: "https://www.dell.com/vostro3400.jpg",
            category: "Laptop",
            brand: "Dell",
            rating: 4.5,
        },
        {
            name: "Lenovo ThinkPad X1 Carbon",
            price: 100000,
            description: "Lenovo ThinkPad X1 Carbon is a laptop with 100000mAh battery",
            image: "https://www.lenovo.com/thinkpadx1carbon.jpg",
            category: "Laptop",
            brand: "Lenovo",
            rating: 4.5,
        },
        {
            name: "HP EliteBook 840 G9",
            price: 100000,
            description: "HP EliteBook 840 G9 is a laptop with 100000mAh battery",
            image: "https://www.hp.com/elitebook840g9.jpg",
            category: "Laptop",
            brand: "HP",
            rating: 4.5,
        },
        {
            name: "Asus ZenBook 14",
            price: 100000,
            description: "Asus ZenBook 14 is a laptop with 100000mAh battery",
            image: "https://www.asus.com/zenbook14.jpg",
            category: "Laptop",
            brand: "Asus",
            rating: 4.5,
        },
        {
            name: "Microsoft Surface Laptop 4",
            price: 100000,
            description: "Microsoft Surface Laptop 4 is a laptop with 100000mAh battery",
            image: "https://www.microsoft.com/surfacelaptop4.jpg",
            category: "Laptop",
            brand: "Microsoft",
            rating: 4.5,
        },
        {
            name: "Razer Blade 15",
            price: 100000,
            description: "Razer Blade 15 is a laptop with 100000mAh battery",
            image: "https://www.razer.com/blade15.jpg",
            category: "Laptop",
            brand: "Razer",
            rating: 4.5,
        },
        {
            name: "Canon EOS R5",
            price: 100000,
            description: "Canon EOS R5 is a camera with 100000mAh battery",
            image: "https://www.canon.com/eosr5.jpg",
            category: "Camera",
            brand: "Canon",
            rating: 4.5,
        },
        {
            name: "Nikon D850",
            price: 100000,
            description: "Nikon D850 is a camera with 100000mAh battery",
            image: "https://www.nikon.com/d850.jpg",
            category: "Camera",
            brand: "Nikon",
            rating: 4.5,
        },
        {
            name: "Sony Alpha 7 III",
            price: 100000,
            description: "Sony Alpha 7 III is a camera with 100000mAh battery",
            image: "https://www.sony.com/alpha7iii.jpg",
            category: "Camera",
            brand: "Sony",
            rating: 4.5,
        },
        {
            name: "Fujifilm X-T4",
            price: 100000,
            description: "Fujifilm X-T4 is a camera with 100000mAh battery",
            image: "https://www.fujifilm.com/xt4.jpg",
            category: "Camera",
            brand: "Fujifilm",
            rating: 4.5,
        },
        {
            name: "Leica Q2",
            price: 100000,
            description: "Leica Q2 is a camera with 100000mAh battery",
            image: "https://www.leica.com/q2.jpg",
            category: "Camera",
            brand: "Leica",
            rating: 4.5,
        },
        {
            name: "Sony TV",
            price: 100000,
            description: "Sony TV is a TV with 100000mAh battery",
            image: "https://www.sony.com/tv.jpg",
            category: "TV",
            brand: "Sony",
            rating: 4.5,
        },
        {
            name: "LG TV",
            price: 100000,
            description: "LG TV is a TV with 100000mAh battery",
            image: "https://www.lg.com/tv.jpg",
            category: "TV",
            brand: "LG",
            rating: 4.5,
        },
        {
            name: "Samsung TV",
            price: 100000,
            description: "Samsung TV is a TV with 100000mAh battery",
            image: "https://www.samsung.com/tv.jpg",
            category: "TV",
            brand: "Samsung",
            rating: 4.5,
        },
        {
            name: "Toshiba TV",
            price: 100000,
            description: "Toshiba TV is a TV with 100000mAh battery",
            image: "https://www.toshiba.com/tv.jpg",
            category: "TV",
            brand: "Toshiba",
            rating: 4.5,
        },
        {
            name: "Panasonic TV",
            price: 100000,
            description: "Panasonic TV is a TV with 100000mAh battery",
            image: "https://www.panasonic.com/tv.jpg",
            category: "TV",
            brand: "Panasonic",
            rating: 4.5,
        },
        {
            name: "Titan Watch",
            price: 100000,
            description: "Titan Watch is a watch with 100000mAh battery",
            image: "https://www.titan.com/watch.jpg",
            category: "Watch",
            brand: "Titan",
            rating: 4.5,
        },
        {
            name: "Rolex Watch",
            price: 100000,
            description: "Rolex Watch is a watch with 100000mAh battery",
            image: "https://www.rolex.com/watch.jpg",
            category: "Watch",
            brand: "Rolex",
            rating: 4.5,
        },  
        {
            name: "Omega Watch",
            price: 100000,
            description: "Omega Watch is a watch with 100000mAh battery",
            image: "https://www.omega.com/watch.jpg",
            category: "Watch",
            brand: "Omega",
            rating: 4.5,
        },
    ])
})


module.exports = router