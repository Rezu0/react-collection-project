import { LINK_API } from '../utils/config.json';

export async function handlerFetchingAllSaldoStaff (token) {
  const headerAllSaldo = new Headers();
  headerAllSaldo.append("Content-Type", "application/json");
  headerAllSaldo.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: 'GET',
    headers: headerAllSaldo,
    redirect: 'follow',
  };

  try {
    const responseFetchingSaldo = await fetch(`${LINK_API}api/staff/all`, requestOptions);
    const returnData = await responseFetchingSaldo.json();
    return returnData;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function handlerFetchingProveProject (token, data) {
  const headerProveProject = new Headers();
  headerProveProject.append("Content-Type", "application/json");
  headerProveProject.append("Authorization", `Bearer ${token}`);
  
  const requestOptions = {
    method: 'POST',
    headers: headerProveProject,
    body: JSON.stringify(data),
    redirect: 'follow'
  };

  try {
    const responseFetchingProve = await fetch(`${LINK_API}api/prove-project`, requestOptions);
    const returnData = await responseFetchingProve.json();
    return returnData;
  } catch (err) {
    console.error(err);
    throw err;
  }
}