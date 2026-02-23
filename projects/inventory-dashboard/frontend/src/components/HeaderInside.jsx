import '../css/HeaderInside.css'

const HeaderInside = ({currentUser}) => {
  return (
    <main className='main-hic'>
      <h1>Welcome {currentUser.username} !</h1>
    </main>
  )
}

export default HeaderInside
