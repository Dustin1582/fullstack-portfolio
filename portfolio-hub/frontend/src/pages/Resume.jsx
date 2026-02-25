import { Link } from 'react-router-dom'
import '../css/Resume.css'

const Resume = () => {
  return (
    <div className='main-resume'>
                <div className="back-button">
                    <Link to="/" className='home'>✖️</Link>
                </div>
        <header className='resume-header'>
            <div className="name">
                <h1 className='green'>DUSTIN ROUTH</h1>
            </div>
            <div className="title">
                <h3>WEB DEVELOPER</h3>
            </div>
        </header>
        <div className="body-resume">
            <div className="contact">
                <div className="number">
                    <h4>336.425.8777</h4>
                </div>
                <div className="br"></div>
                <div className="location">
                    <h4>LEXINGTON, NC</h4>
                </div>
                <div className="br"></div>
                <div className="email">
                    <h4>DUSTINSROU@GMAIL.COM</h4>
                </div>
                <div className="br"></div>
                <div className="download">
                    <a href="/doc/Dustin_Routh_Resume.pdf"
                        download="Dustin_Routh_Resume.pdf"
                        className='resume-download'
                    >Download Resume</a>
                </div>
            </div>
            <div className="obj-c obj">
                <div className="obj-t obj-title">
                    <div className="bt"></div>
                    <h4 className='green'>Objective</h4>
                </div>
                <div className="obj-d obj-desc">
                    <p>Front-end focused web developer seeking an entry-level role 
                    building responsive, user-friendly interfaces with React, HTML, 
                    and CSS. I’m comfortable working with APIs and handling client-side 
                    logic, and I have foundational experience with Node.js/Express and 
                    MongoDB from a full-stack project. Eager to grow on the back end 
                    while contributing strong UI skills, clean code habits, and a reliable, 
                    learn-fast mindset.</p>
                </div>
            </div>
            <div className="skills obj">
                <div className="skills-t obj-title">
                    <div className="bt"></div>
                    <h4 className='green'>Skills & abilities</h4>
                </div>
                <div className="skills-d obj-desc">
                    <p>Front-end focused developer with experience building responsive, 
                    user-friendly interfaces using React, HTML, CSS, and modern JavaScript. 
                    Comfortable working with REST APIs, handling client-side state, and 
                    troubleshooting UI issues. Familiar with backend fundamentals from 
                    a MERN project, including Express routes and MongoDB basics, with 
                    a focus on writing clean, maintainable code.</p>
                </div>
            </div>
            <div className="Experience obj">
                <div className="job-t obj-title">
                    <div className="bt"></div>
                    <h4 className='green'>Experience</h4>
                </div>
                <div className="exp-d obj-desc">
                    <div className="exp-job">
                        <div className="exp-title">
                            <h4 className='green'>Apex Systems (Contractor), CompuCom | IT Support Technician | 2010 – 2012</h4>
                        </div>
                        <div className="job-exp">
                            <ul>
                                <li>Installed and deployed printers across multiple SECU locations statewide, coordinating rollouts to minimize. Configured printer </li>
                                <li>settings and workstation connections, verified network/print functionality, and completed end-to-end setup for users.</li>
                                <li>Troubleshot installation issues on-site and remotely, documented outcomes in ticketing systems, and ensured each location met setup requirements.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="exp-job">
                        <div className="exp-title">
                            <h4 className='green'>Apex Systems (Contractor), CompuCom | IT Support Technician | 2012 – 2013</h4>
                        </div>
                        <div className="job-exp">
                            <ul>
                                <li>Led a workstation refresh project backing up client user data, installing and configuring new workstations, restoring files, and reconnecting mapped network drives.</li>
                                <li>Troubleshot migration and connectivity issues during setup, verified user access, and ensured systems were fully functional before handoff.</li>
                                <li>Documented steps and outcomes, communicated progress clearly to end users, and supported BB&T employees and executives by taking tickets for computer and printer issues when project workload allowed.</li>
                                <li>Recognized for performance on the project, which resulted in a transition from contract work through CompuCom to a full-time position</li>
                            </ul>
                        </div>
                    </div>
                    <div className="exp-job">
                        <div className="exp-title">
                            <h4 className='green'>CompuCom, Client BB&T | IT Support Technician | 2014 – 2021</h4>
                        </div>
                        <div className="job-exp">
                            <ul>
                                <li>Diagnosed and resolved workstation and printer issues, reducing downtime through structured troubleshooting.</li>
                                <li>Documented incidents and solutions clearly, followed escalation procedures, and supported end users in a business environment.</li>
                                <li>Assisted with device setup, connectivity, and general desktop support while maintaining professionalism and security awareness.</li>
                                <li>Assisted with repair and maintaining company servers</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="edu obj">
                <div className="edu-t obj-title">
                    <div className="bt"></div>
                    <h4 className='green'>Education</h4>
                </div>
                <div className="edu-d obj-desc">
                    <div className="school-name-title">
                        <h4>LIBERTY UNIVERSITY</h4>
                    </div>
                    <div className="school-title">
                        <h4 className='green'>Lynchburg, VA | BS in Computer Science</h4>
                    </div>
                    <p>Earned a 3.3 GPA and completed relevant coursework in web development, 
                    database management, and software engineering.</p>
                </div>
            </div>
            <div className="communication-c obj">
                <div className="com-t obj-title">
                    <div className="bt"></div>
                    <h4 className='green'>Communication</h4>
                </div>
                <div className="com-d obj-desc">
                    <p>Strong communication skills developed through daily client support in IT roles. 
                    Experienced explaining technical issues in plain language, asking the right 
                    questions to diagnose problems, documenting solutions clearly, and coordinating 
                    with internal teams to resolve issues efficiently..</p>
                </div>
            </div>
            <div className="leadership-c obj">
                <div className="ldr-t obj-title">
                    <div className="bt"></div>
                    <h4 className='green'>Leadership</h4>
                </div>
                <div className="ldr-d obj-desc">
                    <p>Mentor junior developers, coordinate project tasks, 
                    and implement best practices to ensure timely delivery of high-quality web applications.</p>
                </div>
            </div>

        </div>
      
    </div>
  )
}

export default Resume
