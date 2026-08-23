import React from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { BestSellers } from '../components/home/BestSellers';
import { PromoBanner } from '../components/home/PromoBanner';
import { NewArrivals } from '../components/home/NewArrivals';
import { Inspiration } from '../components/home/Inspiration';
import { Testimonials } from '../components/home/Testimonials';
import { InstagramGallery } from '../components/home/InstagramGallery';
import { Newsletter } from '../components/sections/Newsletter';

export function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <BestSellers />
      <PromoBanner />
      <NewArrivals />
      <Inspiration />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>);

}