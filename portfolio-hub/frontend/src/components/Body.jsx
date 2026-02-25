import { useState } from 'react'
import ProjectCard from './ProjectCard'
import { projects } from '../data/data'
import '../css/Body.css'

const Body = () => {
    const [active, setActive] = useState('react')
    
  return (
    <div className='body-main'>
        <div className="body-title">
            <div className="body-t">
                <h2>Welcome to My Web-Dev Portfolio</h2>
            </div>
            <div className="body-t-desc">
                <p>Discover my collection of web applications built with React, Express, Node.js, and MondoDB</p>
            </div>
            <div className="frameworks">
                <div className={`react ${active === 'react' ? "active" : "" }`}
                    onClick={() => setActive('react')}
                >
                    <img src={`${active === 'react' ? "/hub/react/react-white.svg" : "/hub/react/react-blue.svg"}`} alt="react logo"/>
                    <p className={`react-p ${active === 'react' ? 'p-active' : ''}`}>React</p>
                </div>
                <div className={`express ${active === 'express' ? "active" : "" }`}
                    onClick={() => setActive('express')}
                >
                    <p className={`express-p ${active === 'express' ? 'p-active' : ''}`}>Express</p>
                </div>
                <div className={`mongo ${active === 'mongo' ? 'active' : ''}`}
                    onClick={() => setActive('mongo')}
                >
                    <img src="/hub/mongo/mongo.svg" alt=""/>
                    <p className={`mongo-p ${active === 'mongo' ? 'p-active' : ''}`}>Mongo</p>
                </div>
            </div>
        </div>
        <div className="bb"></div>
        <div className="projects-main">
            <div className="project-title">
                <h1> Projects </h1>
            </div>
            <div className="project-body">
                <ProjectCard cardData={projects}/>
            </div>
        </div>
    </div>
  )
}

export default Body
