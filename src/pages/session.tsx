import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Container from '@/components/Container';
import { useAuth } from '@/hooks/user-auth';
import { AppwriteException } from 'appwrite';

function Session() {
  const { verifyCurrentSession } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const secret = params.get('secret');
    if (typeof userId !== 'string' || typeof secret !== 'string') {
      navigate('/login')
      return;
    }
    (async function run() {
      try {
        await verifyCurrentSession({ userId, secret });
        navigate('/')
      } catch (error) {
        if (error instanceof AppwriteException) {
          navigate(`/login?error=${error.type}`)
        }
      }
      
    })();
  })

  return (
    <Container className="h-screen flex items-center justify-center text-center">
      <p>Logging you in...</p>
    </Container>
  )
}

export default Session;