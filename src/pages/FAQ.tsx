import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { faqs } from '../data/content';
import { cx } from '../utils/format';

export function FAQ() {
  const [open, setOpen] = useState<string | null>('Orders & Delivery-0');

  return (
    <>
      <PageHeader
        eyebrow="Help centre"
        title="Frequently asked questions"
        intro="Everything customers ask most often about delivery, care and returns. If your question is not here, write to us."
        crumbs={[{ label: 'FAQ' }]} />
      

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[240px_1fr] lg:gap-20">
          <nav aria-label="FAQ sections" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col lg:gap-3">
              {faqs.map((group) =>
              <li key={group.group}>
                  <a
                  href={`#${group.group.replace(/\W+/g, '-').toLowerCase()}`}
                  className="text-sm text-smoke transition-colors duration-200 ease-soft hover:text-clay">
                  
                    {group.group}
                  </a>
                </li>
              )}
            </ul>
            <p className="mt-10 hidden text-sm leading-relaxed text-smoke lg:block">
              Still unsure?{' '}
              <Link to="/contact" className="text-ink underline underline-offset-4 hover:text-clay">
                Ask the studio
              </Link>
              .
            </p>
          </nav>

          <div className="space-y-14">
            {faqs.map((group) =>
            <section key={group.group} id={group.group.replace(/\W+/g, '-').toLowerCase()}>
                <h2 className="font-display text-2xl font-light text-ink lg:text-3xl">
                  {group.group}
                </h2>
                <ul className="mt-6 border-t border-sand">
                  {group.items.map((item, index) => {
                  const key = `${group.group}-${index}`;
                  const isOpen = open === key;
                  return (
                    <li key={item.q} className="border-b border-sand">
                        <h3>
                          <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center gap-6 py-5 text-left transition-colors duration-200 ease-soft hover:text-clay">
                          
                            <span className={cx('text-[15px]', isOpen ? 'text-ink' : 'text-ink/90')}>
                              {item.q}
                            </span>
                            <span className="ml-auto text-bark">
                              {isOpen ?
                            <MinusIcon className="h-4 w-4" strokeWidth={1.5} /> :

                            <PlusIcon className="h-4 w-4" strokeWidth={1.5} />
                            }
                            </span>
                          </button>
                        </h3>
                        {isOpen &&
                      <p className="max-w-2xl pb-6 text-sm leading-relaxed text-smoke">
                            {item.a}
                          </p>
                      }
                      </li>);

                })}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </>);

}