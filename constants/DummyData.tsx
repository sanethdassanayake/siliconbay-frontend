const Categories = [
    {
        id: "c1",
        name: "Microcontrollers"
    },
    {
        id: "c2",
        name: "Memory Chips"
    },
    {
        id: "c3",
        name: "Sensors"
    },
    {
        id: "c4",
        name: "Power Management"
    },
    {
        id: "c5",
        name: "Analog & Mixed-Signal"
    },
    {
        id: "c6",
        name: "Digital ICs"
    },
    {
        id: "c7",
        name: "RF & Wireless"
    },
    {
        id: "c8",
        name: "Optoelectronics"
    },
    {
        id: "c9",
        name: "Embedded Processors"
    },
    {
        id: "c10",
        name: "FPGA & CPLD"
    }
];

const Products = [
    {
        id: "p1",
        name: "ARM Cortex-M4 Microcontroller STM32L476",
        brand: "STMicroelectronics",
        price: 24.99,
        discount: 29,
        stock: 1250,
        images: [
            "/products/onsemiconductor.jpg",
            "/products/currentsensor.jpg",
            "/products/npxsemiconductor.jpg",
            "/products/optimos.jpg",
            "/products/microcontroller.jpg",
        ],
        specs: {
            architecture: "ARM Cortex-M4",
            flashMemory: 256,
            gpioPins: 37,
            package: "LQFP-100",
            clockSpeed: 80,
            ram: 64,
            operatingVoltage: "1.65V - 3.6V",
            temperatureRange: "-40 to 85"
        },
        rating: {
            average: 3.6,
            count: 324
        },
        reviews: [
            {
                stars: 5,
                message: "Excellent microcontroller for IoT projects.",
                by: "John Doe",
                date: "2025-01-10",
                images: [
                    "/products/microcontroller.jpg",
                    "/products/npxsemiconductor.jpg"
                ]
            },
            {
                stars: 4,
                message: "Good value for money.",
                by: "Jane Halms",
                date: "2025-10-03",
                images: [
                    "/products/microcontroller.jpg"
                ]
            },
            {
                stars: 2,
                message: "Had some issues with the development tools.",
                by: "Doe Ray",
                date: "2024-12-15",
                images: []
            },
            {
                stars: 3,
                message: "Average performance, nothing exceptional.",
                by: "Chris Evans",
                date: "2025-04-10",
                images: []
            },
            {
                stars: 1,
                message: "Not satisfied with the documentation provided.",
                by: "Sarah Connor",
                date: "2024-11-22",
                images: []
            },
            {
                stars: 2,
                message: "Had some issues with the development tools.",
                by: "Bob Martin",
                date: "2024-12-15",
                images: []
            }
        ]
    },
    {
        id: "p2",
        name: "NAND Flash Memory MT29F128G08CBABA",
        brand: "Micron",
        price: 12.5,
        discount: 15,
        stock: 5400,
        images: [
            "/products/flashmemory.jpg"
        ],
        specs: {
            capacityGB: 128,
            interface: "ONFI 3.0",
            package: "BGA-153",
            voltage: "3.3V",
            temperatureRange: "-40 to 85"
        },
        rating: {
            average: 2.4,
            count: 210
        },
        reviews: [
            {
                stars: 4,
                message: "Reliable NAND for embedded storage.",
                by: "Alice Brown",
                date: "2024-11-22",
                images: []
            }
        ]
    },
    {
        id: "p3",
        name: "Allegro Hall-Effect Current Sensor ACS712",
        brand: "Allegro Microsystems",
        price: 3.7,
        discount: 10,
        stock: 8900,
        images: [
            "/products/currentsensor.jpg"
        ],
        specs: {
            sensingRangeA: 30,
            package: "SOIC-8",
            voltageSupply: "5V",
            temperatureRange: "-40 to 150"
        },
        rating: {
            average: 4.5,
            count: 140
        },
        reviews: [
            {
                stars: 5,
                message: "Highly accurate sensor for current measurements.",
                by: "Mark Reynolds",
                date: "2025-03-05",
                images: []
            }
        ]
    },
    {
        id: "p4",
        name: "Texas Instruments LM317 Adjustable Voltage Regulator",
        brand: "Texas Instruments",
        price: 1.15,
        discount: 5,
        stock: 12000,
        images: [
            "/products/regulator.jpg"
        ],
        specs: {
            outputVoltageRangeV: "1.25 - 37",
            maxOutputCurrentA: 1.5,
            package: "TO-220",
            temperatureRange: "0 to 125"
        },
        rating: {
            average: 4.8,
            count: 430
        },
        reviews: [
            {
                stars: 5,
                message: "Great for power supply projects.",
                by: "Nina Smith",
                date: "2024-12-15",
                images: []
            }
        ]
    },
    {
        id: "p5",
        name: "Infineon OptiMOS MOSFET IPP60R190C7",
        brand: "Infineon",
        price: 4.3,
        discount: 20,
        stock: 4700,
        images: [
            "/products/optimos.jpg"
        ],
        specs: {
            drainSourceVoltageV: 600,
            continuousDrainCurrentA: 43,
            package: "TO-220",
            rdsOnMilliOhm: 1.9,
            temperatureRange: "-55 to 150"
        },
        rating: {
            average: 4.6,
            count: 178
        },
        reviews: [
            {
                stars: 4,
                message: "Efficient MOSFET for power conversion.",
                by: "Sam Lee",
                date: "2025-02-20",
                images: []
            }
        ]
    },
    {
        id: "p6",
        name: "NXP Semiconductor LPC1768 ARM Cortex-M3",
        brand: "NXP",
        price: 29.99,
        discount: 18,
        stock: 3400,
        images: [
            "/products/npxsemiconductor.jpg",
        ],
        specs: {
            architecture: "ARM Cortex-M3",
            flashMemoryKB: 512,
            gpioPins: 70,
            package: "LQFP-100",
            clockSpeedMHz: 100,
            ramKB: 64,
            operatingVoltageV: "3.3",
            temperatureRange: "-40 to 85"
        },
        rating: {
            average: 4.7,
            count: 220
        },
        reviews: [
            {
                stars: 5,
                message: "Ideal for embedded control applications.",
                by: "Laura Moore",
                date: "2024-09-30",
                images: []
            }
        ]
    },
    {
        id: "p7",
        name: "ON Semiconductor NCP1117 Voltage Regulator",
        brand: "ON Semiconductor",
        price: 0.6,
        discount: 12,
        stock: 9000,
        images: [
            "/products/onsemiconductor.jpg"
        ],
        specs: {
            outputVoltageV: 3.3,
            maxOutputCurrentA: 1,
            package: "SOT-223",
            temperatureRange: "-40 to 125"
        },
        rating: {
            average: 4.3,
            count: 150
        },
        reviews: [
            {
                stars: 4,
                message: "Stable and cheap voltage regulator.",
                by: "Chris Johnson",
                date: "2025-01-08",
                images: []
            }
        ]
    },
    // {
    //     id: "p8",
    //     name: "Texas Instruments MSP430G2553 Microcontroller",
    //     brand: "Texas Instruments",
    //     price: 3.99,
    //     discount: 15,
    //     stock: 7500,
    //     images: [
    //         "http://image15.com",
    //         "http://image16.com"
    //     ],
    //     specs: {
    //         architecture: "MSP430",
    //         flashMemoryKB: 16,
    //         gpioPins: 24,
    //         package: "PDIP-28",
    //         clockSpeedMHz: 16,
    //         ramKB: 0.5,
    //         operatingVoltageV: "1.8 - 3.6",
    //         temperatureRange: "-40 to 85"
    //     },
    //     rating: {
    //         average: 4.5,
    //         count: 280
    //     },
    //     reviews: [
    //         {
    //             stars: 5,
    //             message: "Low power MCU perfect for sensor nodes.",
    //             by: "Linda Green",
    //             date: "2025-04-12",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p9",
    //     name: "Analog Devices ADXL335 Accelerometer",
    //     brand: "Analog Devices",
    //     price: 7.5,
    //     discount: 17,
    //     stock: 6200,
    //     images: [
    //         "http://image17.com"
    //     ],
    //     specs: {
    //         axes: 3,
    //         supplyVoltageV: 3,
    //         measurementRangeG: 3,
    //         package: "LFCSP-16",
    //         temperatureRange: "-40 to 85"
    //     },
    //     rating: {
    //         average: 4.6,
    //         count: 190
    //     },
    //     reviews: [
    //         {
    //             stars: 4,
    //             message: "Accurate and easy to interface.",
    //             by: "Peter Wilson",
    //             date: "2024-10-25",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p10",
    //     name: "Xilinx Spartan-6 FPGA XC6SLX45",
    //     brand: "Xilinx",
    //     price: 150,
    //     discount: 25,
    //     stock: 1700,
    //     images: [
    //         "http://image18.com",
    //         "http://image19.com"
    //     ],
    //     specs: {
    //         logicCellsK: 44,
    //         package: "FGG484",
    //         clockSpeedMHz: 200,
    //         ramKB: 2300,
    //         temperatureRange: "0 to 85"
    //     },
    //     rating: {
    //         average: 4.7,
    //         count: 112
    //     },
    //     reviews: [
    //         {
    //             stars: 5,
    //             message: "Powerful FPGA with good support.",
    //             by: "Rachel Kim",
    //             date: "2025-05-01",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p11",
    //     name: "Broadcom BCM43455 Wi-Fi/Bluetooth Combo Chip",
    //     brand: "Broadcom",
    //     price: 8.8,
    //     discount: 22,
    //     stock: 4800,
    //     images: [
    //         "http://image20.com"
    //     ],
    //     specs: {
    //         protocols: ["802.11ac", "Bluetooth 5.0"],
    //         package: "WLCSP",
    //         voltageSupplyV: 3.3,
    //         temperatureRange: "-40 to 85"
    //     },
    //     rating: {
    //         average: 4.4,
    //         count: 160
    //     },
    //     reviews: [
    //         {
    //             stars: 4,
    //             message: "Works well in wireless IoT devices.",
    //             by: "George Lee",
    //             date: "2024-11-12",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p12",
    //     name: "Intel 6th Gen Core i7-6700K Processor",
    //     brand: "Intel",
    //     price: 320,
    //     discount: 5,
    //     stock: 300,
    //     images: [
    //         "http://image21.com",
    //         "http://image22.com"
    //     ],
    //     specs: {
    //         cores: 4,
    //         threads: 8,
    //         baseClockGHz: 4.0,
    //         turboClockGHz: 4.2,
    //         lithographyNm: 14,
    //         tdpWatt: 91,
    //         socket: "LGA1151",
    //         temperatureRange: "0 to 100"
    //     },
    //     rating: {
    //         average: 4.8,
    //         count: 415
    //     },
    //     reviews: [
    //         {
    //             stars: 5,
    //             message: "Excellent processor for gaming and productivity.",
    //             by: "Steven Grant",
    //             date: "2025-02-14",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p13",
    //     name: "Samsung K4B4G1646E DDR3 SDRAM 4Gb",
    //     brand: "Samsung",
    //     price: 25,
    //     discount: 10,
    //     stock: 5600,
    //     images: [
    //         "http://image23.com"
    //     ],
    //     specs: {
    //         capacityGb: 4,
    //         type: "DDR3",
    //         speedMHz: 1600,
    //         voltageV: 1.5,
    //         package: "TSOP-78",
    //         temperatureRange: "0 to 85"
    //     },
    //     rating: {
    //         average: 4.3,
    //         count: 220
    //     },
    //     reviews: [
    //         {
    //             stars: 4,
    //             message: "Reliable RAM chip for various applications.",
    //             by: "Diana Fox",
    //             date: "2024-12-02",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p14",
    //     name: "ON Semiconductor MC14046B Phase-Locked Loop",
    //     brand: "ON Semiconductor",
    //     price: 2.1,
    //     discount: 8,
    //     stock: 6500,
    //     images: [
    //         "http://image24.com"
    //     ],
    //     specs: {
    //         type: "Phase-Locked Loop",
    //         package: "DIP-16",
    //         voltageV: 5,
    //         temperatureRange: "-55 to 125"
    //     },
    //     rating: {
    //         average: 4.2,
    //         count: 135
    //     },
    //     reviews: [
    //         {
    //             stars: 4,
    //             message: "Good PLL for timing circuits.",
    //             by: "Tim Bates",
    //             date: "2025-03-18",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p15",
    //     name: "Microchip PIC16F877A Microcontroller",
    //     brand: "Microchip",
    //     price: 5.6,
    //     discount: 12,
    //     stock: 8300,
    //     images: [
    //         "http://image25.com",
    //         "http://image26.com"
    //     ],
    //     specs: {
    //         flashMemoryKb: 14,
    //         ramBytes: 368,
    //         gpioPins: 33,
    //         package: "PDIP-40",
    //         clockSpeedMHz: 20,
    //         operatingVoltageV: "2 - 5.5",
    //         temperatureRange: "-40 to 85"
    //     },
    //     rating: {
    //         average: 4.6,
    //         count: 390
    //     },
    //     reviews: [
    //         {
    //             stars: 5,
    //             message: "Widely used MCU, very stable.",
    //             by: "Olivia Martinez",
    //             date: "2025-01-20",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p16",
    //     name: "Texas Instruments TMS320F28379D DSP",
    //     brand: "Texas Instruments",
    //     price: 250,
    //     discount: 18,
    //     stock: 900,
    //     images: [
    //         "http://image27.com"
    //     ],
    //     specs: {
    //         cores: 2,
    //         clockSpeedMHz: 200,
    //         ramKB: 256,
    //         package: "BGA-337",
    //         voltageSupplyV: 1.2,
    //         temperatureRange: "-40 to 105"
    //     },
    //     rating: {
    //         average: 4.7,
    //         count: 95
    //     },
    //     reviews: [
    //         {
    //             stars: 5,
    //             message: "High performance DSP for motor control.",
    //             by: "Evan Wright",
    //             date: "2024-08-14",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p17",
    //     name: "Realtek RTL8111H Gigabit Ethernet Controller",
    //     brand: "Realtek",
    //     price: 3.8,
    //     discount: 10,
    //     stock: 7400,
    //     images: [
    //         "http://image28.com"
    //     ],
    //     specs: {
    //         interface: "PCIe x1",
    //         speedMbps: 1000,
    //         package: "QFN-48",
    //         voltageSupplyV: 3.3,
    //         temperatureRange: "-40 to 85"
    //     },
    //     rating: {
    //         average: 4.5,
    //         count: 180
    //     },
    //     reviews: [
    //         {
    //             stars: 4,
    //             message: "Stable and fast Ethernet controller.",
    //             by: "Matt Turner",
    //             date: "2025-02-02",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p18",
    //     name: "Maxim Integrated MAX232 RS-232 Transceiver",
    //     brand: "Maxim Integrated",
    //     price: 1.2,
    //     discount: 7,
    //     stock: 11000,
    //     images: [
    //         "http://image29.com"
    //     ],
    //     specs: {
    //         supplyVoltageV: 5,
    //         package: "SOIC-16",
    //         maxBaudRate: 120000,
    //         temperatureRange: "-40 to 85"
    //     },
    //     rating: {
    //         average: 4.4,
    //         count: 220
    //     },
    //     reviews: [
    //         {
    //             stars: 5,
    //             message: "Essential chip for serial communication.",
    //             by: "Sophie Grant",
    //             date: "2024-10-01",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p19",
    //     name: "Analog Devices ADP2302 DC-DC Buck Converter",
    //     brand: "Analog Devices",
    //     price: 6.9,
    //     discount: 16,
    //     stock: 5400,
    //     images: [
    //         "http://image30.com"
    //     ],
    //     specs: {
    //         inputVoltageV: "4.5 - 20",
    //         outputVoltageV: "0.8 - 17",
    //         maxOutputCurrentA: 2,
    //         package: "MSOP-8",
    //         temperatureRange: "-40 to 85"
    //     },
    //     rating: {
    //         average: 4.6,
    //         count: 105
    //     },
    //     reviews: [
    //         {
    //             stars: 5,
    //             message: "Compact and efficient switching regulator.",
    //             by: "Chris O'Neal",
    //             date: "2025-03-25",
    //             images: []
    //         }
    //     ]
    // },
    // {
    //     id: "p20",
    //     name: "Renesas R5F104LEA 32-bit MCU",
    //     brand: "Renesas",
    //     price: 17.5,
    //     discount: 20,
    //     stock: 4200,
    //     images: [
    //         "http://image31.com",
    //         "http://image32.com"
    //     ],
    //     specs: {
    //         architecture: "RXv1",
    //         flashMemoryKB: 256,
    //         ramKB: 32,
    //         package: "LQFP-48",
    //         clockSpeedMHz: 50,
    //         operatingVoltageV: "2.7 - 3.6",
    //         temperatureRange: "-40 to 85"
    //     },
    //     rating: {
    //         average: 4.5,
    //         count: 140
    //     },
    //     reviews: [
    //         {
    //             stars: 4,
    //             message: "Versatile MCU with good peripheral set.",
    //             by: "Anna Collins",
    //             date: "2024-09-18",
    //             images: []
    //         }
    //     ]
    // }
];

export { Categories, Products };