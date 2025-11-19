/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import AnimatedSection from '../components/AnimatedSection';

const About = () => {
    return (
        <>
            <AnimatedSection className="mb-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-8 text-center">About Me</h1>
            </AnimatedSection>

            <AnimatedSection className="mb-16 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-medium mb-6">Who I Am</h2>
                <p className="mb-6 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
                    Hello! I'm Saugat Dhungana, a versatile developer with a deep passion for creating innovative
                    solutions across Web Development, AI/ML, and the Internet of Things. I thrive on turning complex
                    problems into elegant, user-friendly applications. My journey in technology is driven by a
                    relentless curiosity and a desire to build things that make a difference.
                </p>
                <p className="mb-8 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
                    I specialize in building responsive front-end experiences with React and modern JavaScript,
                    but I'm equally comfortable diving into the world of machine learning models or tinkering with
                    IoT hardware. I'm a lifelong learner, constantly exploring new tools and paradigms to push the
                    boundaries of what's possible.
                </p>
            </AnimatedSection>

            <AnimatedSection className="mb-16 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-medium mb-6">My Journey</h2>
                <p className="mb-6 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
                    My tech journey began with a fascination for how things work. From building my first simple
                    websites to developing complex AI-powered applications, every project has been a stepping stone
                    in my continuous learning path. I believe in learning by doing, and I've built numerous projects
                    that have taught me invaluable lessons about software development, user experience, and problem-solving.
                </p>
                <p className="mb-8 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
                    Currently, I'm expanding my expertise in AI/ML through my internship at IOXET in Lalitpur, where
                    I'm working on cutting-edge artificial intelligence projects. Alongside this, I continue to take
                    on freelance projects that challenge me and allow me to apply my diverse skill set.
                </p>
            </AnimatedSection>

            <AnimatedSection className="mb-16 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-medium mb-6">What Drives Me</h2>
                <p className="mb-6 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
                    I'm driven by the potential of technology to solve real-world problems. Whether it's creating
                    a seamless user interface that makes people's lives easier, training an AI model to automate
                    complex tasks, or building an IoT device that bridges the physical and digital worlds, I find
                    joy in the creative process of bringing ideas to life.
                </p>
                <p className="mb-8 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
                    Beyond coding, I'm passionate about continuous learning, sharing knowledge with others, and
                    staying updated with the latest trends in technology. I believe that the best solutions come
                    from collaboration, and I'm always excited to work with like-minded individuals on meaningful projects.
                </p>
            </AnimatedSection>

            <AnimatedSection className="mb-16 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-medium mb-6">Let's Connect</h2>
                <p className="mb-8 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
                    I'm always open to new opportunities, collaborations, and conversations about technology.
                    Whether you have a project idea, want to discuss the latest in AI/ML, or just want to connect,
                    feel free to reach out!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="./Saugat-Dhungana-cv.pdf"
                        download
                        className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-sm sm:text-base font-medium border border-[var(--text-primary)] hover:bg-transparent hover:text-[var(--text-primary)] transition-all text-center"
                    >
                        Download My CV
                    </a>
                    <a
                        href="/contact"
                        className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-transparent text-[var(--text-primary)] rounded-full text-sm sm:text-base font-medium border border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all text-center"
                    >
                        Get in Touch
                    </a>
                </div>
            </AnimatedSection>
        </>
    );
};

export default About;
