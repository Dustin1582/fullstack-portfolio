import '../css/ProjectCard.css'
import { Link } from 'react-router-dom'
const ProjectCard = ({cardData}) => {
    if(cardData) {
        console.log(cardData)
    }
  
    return (
        <>
            {cardData.map(card => {
                return (
                    <div className='card-container' key={card.name}>
                        <div className="inner-card-container">
                            <div className="card-title-container">
                                <div className="icon-box">
                                    <img src={card.icon} alt={card.name} />
                                </div>
                                <div className="card-title-desc">
                                    <div className="card-title">
                                        <h3>{card.name}</h3>
                                    </div>
                                    <div className="card-desc">
                                        <p>{card.desc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-made-with">
                                {card.createdWith.map(framework => (
                                    <div 
                                        className={`card-framework ${framework.name.toLowerCase()}1`} 
                                        key={framework.name}
                                        style={{backgroundColor: framework.color}}
                                    >
                                        <p style={{color: framework.darkColor}}>{framework.name}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="card-button-container">
                                <div className="card-button-ic">
                                    <Link to={card.link}>
                                        <div className="card-button">
                                            <p>Launch App &rsaquo;</p>
                                        </div>

                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                )

            })}

        </>
    )
}

export default ProjectCard
