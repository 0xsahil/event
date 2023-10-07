import { useState, useEffect } from 'react';
import { Redirect } from 'wouter';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import FormRow from '@/components/FormRow';
import FormLabel from '@/components/FormLabel';
import InputText from '@/components/InputText';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/user-auth';

function LogIn() {
  const { session, logIn } = useAuth();
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error === 'user_invalid_token') {
      setErrorMsg('Your session has experied. Please try again');
    }
  }, [])
  
  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string }
    }
    await logIn(target.email.value);
    setSent(true);
  }
  if (session) {
    return <Redirect to='/' />
  }
  return (
    <Layout>
      <Container>
        <h1 className="text-3xl font-bold text-center mb-6">
          Log In
        </h1>
        {errorMsg && (
          <p className="bg-red-500 max-w-sm mx-auto p-4 mb-6 rounded">{errorMsg}</p>
        )}
        {!sent && (
          <form className="max-w-xs border border-slate-200 dark:border-slate-500 rounded p-6 mx-auto" onSubmit={handleOnSubmit}>
            <FormRow className="mb-5">
              <FormLabel htmlFor="email">Email</FormLabel>
              <InputText id="email" name="email" type="email" />
            </FormRow>

            <Button>Submit</Button>
          </form>
        )}
        {sent && (
          <p className='text-center'>Check your email from <span className="font-bold">
            Appwrite</span> for magic URL</p>
        )}
      </Container>
    </Layout>
  )
}

export default LogIn;