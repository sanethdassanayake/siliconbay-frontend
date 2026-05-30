import { CreditCard, Facebook, Instagram, Landmark, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer>
      <div className='bg-gray-950 text-gray-300 text-sm px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='w-2/3 mx-auto'>
          <span className='font-medium text-lg'>Get to know us</span>
          <div className='mt-2 grid text-start'>
            <Link href="#" className='hover:underline hover:text-white'>About Us</Link>
            <Link href="#" className='hover:underline hover:text-white'>Careers</Link>
            <Link href="#" className='hover:underline hover:text-white'>Press Releases</Link>
            <Link href="#" className='hover:underline hover:text-white'>Blog</Link>
          </div>
        </div>
        <div className='w-2/3 mx-auto'>
          <span className='font-medium text-lg'>Make money with us</span>
          <div className='mt-2 grid text-start'>
            <Link href="#" className='hover:underline hover:text-white'>Sell with Us</Link>
            <Link href="#" className='hover:underline hover:text-white'>Become Affiliate</Link>
            <Link href="#" className='hover:underline hover:text-white'>Advertise</Link>
          </div>
        </div>
        <div className='w-2/3 mx-auto'>
          <span className='font-medium text-lg'>Help</span>
          <div className='mt-2 grid text-start'>
            <Link href="#" className='hover:underline hover:text-white'>Customer Support</Link>
            <Link href="#" className='hover:underline hover:text-white'>Contact Us</Link>
            <Link href="#" className='hover:underline hover:text-white'>Return Center</Link>
          </div>
        </div>
        <div className='w-2/3 mx-auto'>
          <span className='font-medium text-lg'>Legal</span>
          <div className='mt-2 grid text-start'>
            <Link href="#" className='hover:underline hover:text-white'>Privacy Policy</Link>
            <Link href="#" className='hover:underline hover:text-white'>Terms of Service</Link>
            <Link href="#" className='hover:underline hover:text-white'>Cookie Policy</Link>
          </div>
        </div>
        <div className='w-2/3 mx-auto'>
          <span className='font-medium text-lg'>Connect with us</span>
          <div className='mt-2 flex text-start gap-2'>
            <Link href="#" className='hover:underline hover:text-white'>
              <Facebook />
            </Link>
            <Link href="#" className='hover:underline hover:text-white'>
              <Twitter />
            </Link>
            <Link href="#" className='hover:underline hover:text-white'>
              <Instagram />
            </Link>
          </div>
        </div>
        <div className='w-2/3 mx-auto'>
          <span className='font-medium text-lg'>Download our App</span>
          <div className='mt-2 grid text-start'>
            <Link href="#" className='hover:underline hover:text-white'>App Store</Link>
            <Link href="#" className='hover:underline hover:text-white'>Google Play</Link>
          </div>
        </div>
        <div className='w-2/3 mx-auto'>
          <span className='font-medium text-lg'>Shipping & Delivery</span>
          <div className='mt-2 grid text-start'>
            <Link href="#" className='hover:underline hover:text-white'>Shipping Options</Link>
            <Link href="#" className='hover:underline hover:text-white'>Track Order</Link>
            <Link href="#" className='hover:underline hover:text-white'>Delivery Information</Link>
          </div>
        </div>
        <div className='w-2/3 mx-auto'>
          <span className='font-medium text-lg'>Payment Methods</span>
          <div className='mt-2 flex text-start gap-2'>
            <Link href="#" className='hover:underline hover:text-white flex items-center gap-1'>
              <CreditCard />
            </Link>
            <Link href="#" className='hover:underline hover:text-white flex items-center gap-1'>
              <Image src="/paypal.png" alt="PayPal" width={24} height={24} />
            </Link>
            <Link href="#" className='hover:underline hover:text-white flex items-center gap-1'>
              <Landmark />
            </Link>
          </div>
        </div>
      </div>

      <div className='bg-gray-900 text-gray-400 text-center text-sm p-2'>
        &copy; 2024 SiliconBay. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer