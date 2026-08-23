import React from 'react';
import { HeartIcon, InstagramIcon } from 'lucide-react';
import { instagramPosts } from '../../data/content';

export function InstagramGallery() {
  return (
    <section className="mx-auto max-w-shell px-5 py-20 lg:px-8 lg:py-28">
      <div className="flex flex-col items-center text-center">
        <p className="eyebrow text-clay">@tagdiah</p>
        <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink sm:text-4xl">
          Tag your room with #MyTagdiah
        </h2>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-smoke">
          We repost one customer photograph every week — and send a ৳1,000 credit when we do.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {instagramPosts.map((post) =>
        <li key={post.id}>
            <a
            href="#"
            className="group relative block overflow-hidden bg-linen"
            aria-label={`Instagram post: ${post.caption}`}>
            
              <div className="aspect-square w-full">
                <img
                src={post.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 ease-soft group-hover:scale-[1.05]"
                loading="lazy" />
              
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/55 opacity-0 transition-opacity duration-200 ease-soft group-hover:opacity-100">
                <InstagramIcon className="h-5 w-5 text-cream" strokeWidth={1.5} />
                <span className="flex items-center gap-1.5 text-xs text-cream">
                  <HeartIcon className="h-3.5 w-3.5 fill-cream" strokeWidth={1.5} />
                  {post.likes.toLocaleString()}
                </span>
              </div>
            </a>
          </li>
        )}
      </ul>
    </section>);

}