import { useState } from "preact/hooks";
import { authorize } from "../utils/spotify";

export default function Home() {
  const [clientId, setClientId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const error = location.href.split("error=")[1]?.split("&")[0];
  if (error) {
    setErrorMessage(  error.includes("_") ?  "Something went wrong" : decodeURIComponent(error) );
  } 

  return (
    <div className="home">
      <h1>Connect with Spotify</h1>
      <p>Bring your own application and rate limit.</p>
      <form
        onSubmit={(e: Event) => {
          e.preventDefault();
          try {
            authorize(clientId, clientSecret);
          } catch (e) {
            setErrorMessage(e instanceof Error ? e.message : "Something went wrong");
          }
        }}
      >
        <input value={clientId} type="text" placeholder="Client ID" onInput={(e) => setClientId(e.currentTarget.value)} />
        <input value={clientSecret} type="text" placeholder="Client Secret" onInput={(e) => setClientSecret(e.currentTarget.value)} />
        <input value="Connect" type="submit" />
        {errorMessage && <em>{errorMessage}</em>}
      </form>
    </div>
  );
}
