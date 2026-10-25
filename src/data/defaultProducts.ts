import { Product } from '../types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'ASUS ROG Strix G16 Gaming Laptop',
    category: 'Laptops',
    price: 1399.99,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    description: 'Intel Core i7 13th Gen, NVIDIA RTX 4060 8GB, 16GB DDR5 RAM, 1TB NVMe Gen4 SSD, 165Hz FHD ROG Nebula Display.',
    specs: ['Intel Core i7-13650HX', 'NVIDIA GeForce RTX 4060 8GB', '16GB DDR5 4800MHz', '1TB PCIe 4.0 NVMe M.2 SSD', '16-inch 165Hz IPS Display'],
    featured: true
  },
  {
    id: 'prod-2',
    name: 'Dell XPS 15 InfinityEdge Workstation',
    category: 'Laptops',
    price: 1599.00,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    description: 'OLED 3.5K Touch Display, Intel Core i9, 32GB DDR5 RAM, 1TB SSD, CNC Machined Aluminum chassis for pros and creators.',
    specs: ['Intel Core i9-13900H', '32GB DDR5 RAM', '1TB NVMe SSD', '15.6-inch 3.5K OLED Touch', 'Thunderbolt 4 Ports'],
    featured: true
  },
  {
    id: 'prod-3',
    name: 'Samsung Odyssey G7 27" Curved Gaming Monitor',
    category: 'Monitors',
    price: 299.50,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    description: '1000R Curvature, 240Hz Refresh Rate, 1ms Response Time, 1440p WQHD resolution with AMD FreeSync Premium Pro & G-Sync.',
    specs: ['27-inch 1000R Curved Panel', '2560 x 1440 (WQHD)', '240Hz Refresh Rate', '1ms (GtG) Response', 'HDR600 Support'],
    featured: true
  },
  {
    id: 'prod-4',
    name: 'Logitech G PRO X Mechanical Keyboard',
    category: 'Gaming Peripherals',
    price: 129.99,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    description: 'LIGHTSYNC RGB, Hot-Swappable Pro-Grade Mechanical Switches, Tenkeyless compact tournament design with detachable cable.',
    specs: ['Hot-swappable GX Blue Clicky Switches', 'Compact Tenkeyless Design', 'LIGHTSYNC RGB Lighting', 'Onboard Memory Profiles'],
    featured: false
  },
  {
    id: 'prod-5',
    name: 'Razer DeathAdder V3 Pro Wireless Mouse',
    category: 'Gaming Peripherals',
    price: 89.00,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-lightweight 63g ergonomic form factor, Focus Pro 30K Optical Sensor, Gen-3 Optical Switches, 90-hour battery life.',
    specs: ['Focus Pro 30K Optical Sensor', '63g Ultra-lightweight', 'Optical Mouse Switches Gen-3', 'HyperSpeed Wireless'],
    featured: false
  },
  {
    id: 'prod-6',
    name: 'NVIDIA GeForce RTX 4070 Ti Super 16GB',
    category: 'Components',
    price: 799.99,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    description: '16GB GDDR6X VRAM, Ada Lovelace Architecture, DLSS 3.5 Frame Generation, Full Ray Tracing, Triple Fan Axial-tech Cooling.',
    specs: ['16GB GDDR6X 256-bit', '8448 CUDA Cores', 'DLSS 3.5 & Ray Tracing', 'Boost Clock 2610 MHz', '750W Recommended PSU'],
    featured: true
  },
  {
    id: 'prod-7',
    name: 'HyperX Cloud II Wireless Gaming Headset',
    category: 'Gaming Peripherals',
    price: 119.50,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    description: 'DTS Headphone:X Spatial Audio, 53mm dynamic drivers, signature memory foam comfort, detachable noise-cancelling mic.',
    specs: ['2.4GHz Low-Latency Wireless', 'Up to 30 Hours Battery Life', 'DTS Headphone:X Spatial Audio', 'Durable Aluminum Frame'],
    featured: false
  },
  {
    id: 'prod-8',
    name: 'Anker PowerExpand 8-in-1 USB-C Hub',
    category: 'Accessories',
    price: 45.00,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80',
    description: '85W Power Delivery pass-through, Dual 4K 60Hz HDMI, 10Gbps USB-C & USB-A data ports, SD/microSD card reader, Gigabit Ethernet.',
    specs: ['Dual 4K HDMI Output', '85W Pass-Through Charging', '10Gbps High-Speed Data', 'Gigabit Ethernet Port'],
    featured: false
  },
  {
    id: 'prod-9',
    name: 'Samsung 990 PRO 2TB NVMe SSD with Heatsink',
    category: 'Components',
    price: 179.99,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    description: 'PCIe Gen 4.0 x4 M.2 2280, speeds up to 7,450 MB/s read and 6,900 MB/s write. PS5 compatible slim heatsink.',
    specs: ['PCIe 4.0 NVMe Technology', '7450 MB/s Sequential Read', '6900 MB/s Sequential Write', 'Integrated Smart Heatsink'],
    featured: false
  },
  {
    id: 'prod-10',
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz',
    category: 'Components',
    price: 124.99,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    description: 'High-performance optimized for Intel & AMD motherboards with dynamic ten-zone RGB lighting and onboard voltage regulation.',
    specs: ['32GB Kit (2 x 16GB)', '6000MHz Frequency', 'CL30 Low Latency', 'Intel XMP 3.0 & AMD EXPO'],
    featured: false
  }
];

export const DEFAULT_SETTINGS: {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  announcement: string;
  adminUsername: string;
  adminPasswordHash: string;
} = {
  storeName: 'NS Computers & Electronics',
  tagline: 'Tech Store & Service Hub',
  phone: '0717592590',
  email: 'nscomputers.store@gmail.com',
  address: 'No. 45 Commercial Center, High Level Road, Colombo / Kandy, Sri Lanka',
  currency: '$',
  announcement: 'Islandwide Express Delivery | Call / WhatsApp 0717592590 for Custom PC Builds & Tech Support',
  adminUsername: 'admin',
  adminPasswordHash: 'DsL5151#'
};
