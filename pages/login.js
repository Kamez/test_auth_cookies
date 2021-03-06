import { useState } from 'react'
import useUser from '../lib/useUser'
import Layout from '../components/Layout'
import Form from '../components/Form'
import fetchJson from '../lib/fetchJson'
import withSession from '../lib/session'

const Login = () => {
  const { mutateUser } = useUser({
    redirectTo: '/profile-sg',
    redirectIfFound: true,
  })

  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    const body = {
      username: e.currentTarget.username.value,
    }

    try {
      await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMsg(error.data.message)
    }
  }

  return (
    <Layout>
      <div className="login">
        <Form isLogin errorMessage={errorMsg} onSubmit={handleSubmit} />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps = withSession(async function ({req, res})  {
  // req.session.destroy('test_token')
  const token = req.session.get('test_token')
  console.log(token);

  if(token) {
    console.log(`already logged in`);
    res.writeHead(301, { Location: '/profile-sg'})
    res.end()
  }

  return {
    props: {
      token: token || null
    },
  }
})

export default Login
