"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowButton } from "@/components/atoms/button";
import { Subtitle } from "@/components/atoms/subtitle";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type ValueItem = {
  icon: string;
  title: string;
  description: string;
};

export type TeamMember = {
  image: string;
  name: string;
  position: string;
  description: string;
};

type AboutUsProps = {
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  values: ValueItem[];
  team?: TeamMember[];
  cta: {
    text: string;
    href: string;
  };
  image: string;
};

const AboutUs = ({
  title,
  subtitle,
  description,
  mission,
  vision,
  values,
  team,
  cta,
  image,
}: AboutUsProps) => {
  return (
    <section className="relative w-full overflow-hidden bg-background py-20">
      <div className="container mx-auto">
        {/* Naslov i uvod */}
        <div className="mb-16 text-center">
          <Subtitle className="mx-auto mb-6 inline-block" variant="transparent">
            {subtitle}
          </Subtitle>
          <h2 className="mb-8 text-5xl font-bold tracking-tight">{title}</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Glavna sekcija */}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Slika */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[30rem] overflow-hidden rounded-3xl"
          >
            <Image
              src={image || "/placeholder-office.jpg"}
              alt="O nama"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/80 to-transparent p-8 text-white">
              <p className="font-semibold">{vision}</p>
            </div>
          </motion.div>

          {/* Sadržaj */}
          <div className="flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-muted/30 p-6"
            >
              <h3 className="mb-4 text-2xl font-bold">Naša Misija</h3>
              <p className="text-muted-foreground">{mission}</p>
            </motion.div>

            {/* Vrijednosti */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Naše Vrijednosti</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {values.map((value, index) => (
                  <motion.div
                    key={`value-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Image
                        src={value.icon || "/icons/value-placeholder.svg"}
                        alt={value.title}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{value.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link href={cta.href as never}>
                <ArrowButton variant="ghost" className="mt-4">
                  {cta.text}
                </ArrowButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Tim (opcionalno) */}
        {team && team.length > 0 && (
          <div className="mt-24">
            <h3 className="mb-10 text-center text-3xl font-bold">Naš Tim</h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {team.map((member, index) => (
                <motion.div
                  key={`team-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-xl bg-white shadow-lg"
                >
                  <div className="h-56 overflow-hidden">
                    <Image
                      src={member.image || "/placeholder-person.jpg"}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-xl font-semibold">{member.name}</h4>
                    <p className="mb-3 text-sm text-primary">
                      {member.position}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pozadinski elementi */}
      <div className="absolute -top-20 left-0 right-0 z-0 h-72 w-full bg-[radial-gradient(circle,rgba(49,120,198,0.05),transparent_25%)]"></div>
      <div className="absolute bottom-0 right-0 z-0 h-full w-1/3 bg-[radial-gradient(circle,rgba(173,216,230,0.1),transparent_25%)]"></div>
    </section>
  );
};

export default AboutUs;
