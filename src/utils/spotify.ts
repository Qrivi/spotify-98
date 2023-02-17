// region Type Guards

export const isTrackObjectFull = (item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject | null | undefined): item is SpotifyApi.TrackObjectFull => {
  return !!item && 'artists' in item;
}

// endregion
// region API

export const authorize = (clientId: string, clientSecret: string) => {
  if (!/^[a-f0-9]{32}$/.test(clientId)) {
    throw new Error("Invalid Client ID");
  }
  if(!/^[a-f0-9]{32}$/.test(clientSecret)) {
    throw new Error("Invalid Client Secret");
  }

  const connectionState = Math.random().toString(36);
  localStorage.setItem("connectionState", connectionState);
  localStorage.setItem("clientId", clientId);
  localStorage.setItem("clientSecret", clientSecret);

  let url = "https://accounts.spotify.com/authorize?response_type=code&scope=user-read-currently-playing";
  url += "&redirect_uri=" + encodeURIComponent(`${location.protocol}//${location.host}${location.pathname}`);
  url += "&client_id=" + encodeURIComponent(clientId);
  url += "&state=" + encodeURIComponent(connectionState);

  location.assign(url);
};

export const getToken = async (code :string): Promise<[string,string]> => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      authorization: `Basic ${btoa(`${localStorage.getItem('clientId')}:${localStorage.getItem('clientSecret')}`)}`,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      redirect_uri: `${location.protocol}//${location.host}${location.pathname}`,
      grant_type: 'authorization_code',
      code,
    })
  })

  // TODO Verify the response is ok
  const data = await response.json();
  console.log(data)
  return [ data.access_token, data.refresh_token ];
}

export const refreshToken = async (refreshToken :string): Promise<string> => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      authorization: `Basic ${btoa(`${localStorage.getItem('clientId')}:${localStorage.getItem('clientSecret')}`)}`,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })
  })

  // TODO Verify the response is ok
  const data = await response.json();
  console.log(data)
  return data.access_token;
}

export const currentlyPlaying = async (token: string): Promise<SpotifyApi.CurrentlyPlayingObject | undefined> => {
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 429) {
    throw new Error("Rate limit reached");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("Token expired");
  }

  if (response.status === 204) {
    return undefined;
  }

  const data = await response.json();
  console.log(data);
  return data;
};

// endregion
