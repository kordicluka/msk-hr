"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowButton, Button } from "@/components/atoms/button";
import Image from "next/image";
import {
  CardContent,
  CardHeader,
  Card,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { cn } from "@/lib/utils";

export type Project = {
  id: number;
  title: string;
  serviceType: string;
  description: string;
  image: string;
  slug: string;
  category: string;
};

export type ProjectsCategory = {
  id: string;
  label: string;
};

type ProjectsProps = {
  projects: Project[];
  categories: ProjectsCategory[];
  cta: {
    text: string;
    href: string;
  };
};

const Projects = ({ projects, categories }: ProjectsProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="container mx-auto flex flex-col items-center ">
        {/* Filteri kategorija */}
        <motion.div
          className="mb-20 flex w-fit bg-gray-100 shadow-sm  rounded-full p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant={activeCategory === "all" ? "secondary" : "ghost"}
            onClick={() => setActiveCategory("all")}
          >
            Svi projekti
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "secondary" : "ghost"}
              className={
                activeCategory !== category.id ? "hover:bg-gray-200" : ""
              }
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </motion.div>

        {/* Projekti grid */}
        <div className="grid grid-cols-1 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-[36rem]"
            >
              <Card
                className={cn(
                  "text-primary border-none bg-white p-0 h-[36rem] rounded-none shadow-none w-full relative overflow-hidden flex flex-row"
                )}
              >
                <CardHeader className="flex justify-start shadow-sm p-0 rounded-none m-0 w-1/2 h-full">
                  <div className=" w-full h-full m-0 p-0  bg-gray-100 flex items-start justify-start overflow-hidden">
                    <Image
                      src={project.image}
                      alt={`${project.title} Icon`}
                      width={500}
                      height={500}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </CardHeader>

                <CardContent className="p-12 w-1/2 h-full flex flex-col items-start justify-start">
                  <h3 className="text-6xl leading-20 font-extrabold mb-5">
                    {project.title}
                  </h3>
                  {project.serviceType && (
                    <Badge variant="secondary" className="mb-5">
                      {project.serviceType}
                    </Badge>
                  )}
                  <p className="text-gray-600 mb-10">{project.description}</p>{" "}
                  <ArrowButton variant="ghost" className="pl-0">
                    Istraži više
                  </ArrowButton>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Prazno stanje */}
        {filteredProjects.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center space-y-4 rounded-xl bg-muted/20 p-12 text-center">
            <div className="rounded-full bg-muted/50 p-4">
              <Image
                src="/icons/folder-open.svg"
                alt="Nema projekata"
                width={40}
                height={40}
              />
            </div>
            <h3 className="text-xl font-semibold">
              Nema projekata u ovoj kategoriji
            </h3>
            <p className="text-muted-foreground">
              Trenutno nemamo projektne primjere za ovu kategoriju. Molimo
              odaberite drugu kategoriju.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
