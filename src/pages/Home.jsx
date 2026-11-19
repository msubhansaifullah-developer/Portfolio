import About from "../sections/About";
import Approach from "../sections/Approach";
import Contact from "../sections/Contact";
import Experience from "../sections/Experience";
import Hero from "../sections/Hero";
import Projects from "../sections/Projects";
import Skills from "../sections/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Approach />
      <Contact />
    </>
  );
}
