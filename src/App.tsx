import React, { useEffect } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from './auth-config';
// import { EventType } from '@azure/msal-browser';

const WrappedView: React.FC = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleLoginRedirect = () => {
    try {
    
    // const callbackId = instance.addEventCallback((event)=>{
    //   if(event.eventType === EventType.INITIALIZE_END)
        instance?.loginRedirect({
          ...loginRequest,
          prompt: 'create',
        });
    // })

    // return callbackId
     
    } catch (err) {
      console.error("Login redirect failed:", err);
      return null;
    }
  };

  const handleLogoutRedirect = ()=>{
        try {
          instance.logoutRedirect(
            {
              postLogoutRedirectUri: "/"
            }
          );
        } catch (err) {
          console.error("Logout redirect failed:", err);
        }
  }

  // useEffect(() => {
  //   let callbackId: string|null = ""
  //   if (!activeAccount) {
  //     callbackId = handleLoginRedirect();
  //   }

  //   return () => {
  //     if(callbackId)
  //         instance.removeEventCallback(callbackId);
  // };
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeAccount]); 

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!activeAccount) {
        handleLoginRedirect();
      }
    }, 1000);

    return () => clearTimeout(timerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount]);


  return (
    <div className='App'>
      <AuthenticatedTemplate>
        {activeAccount && (
          <div>
            <h1>{activeAccount.name} with email: {activeAccount.username} is active</h1>
            <button onClick={handleLogoutRedirect}>Logout</button>
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        {/* <p>You are logged out...</p> */}
      </UnauthenticatedTemplate>
    </div>
  );
};

const App: React.FC = () => {
  return <WrappedView />;
};

export default App;
