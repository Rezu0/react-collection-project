import { redirect } from 'react-router-dom';
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

export async function handlerFetchingButtonWithdraw(token, data) {
  const headerButton = new Headers();
  headerButton.append("Content-Type", "application/json");
  headerButton.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: 'PUT',
    headers: headerButton,
    body: JSON.stringify(data),
    redirect: 'follow'
  };

  try {
    const responseFetchingButton = await fetch(`${LINK_API}api/withdraw/button`, requestOptions);
    const returnData = await responseFetchingButton.json();
    return returnData;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function handlerFetchingShowStatus() {
  const headerButton = new Headers();
  headerButton.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'GET',
    headers: headerButton,
    redirect: 'follow',
  };

  try {
    const responseStatus = await fetch(`${LINK_API}api/withdraw/button`, requestOptions);
    const returnData = await responseStatus.json()
    return returnData;
  } catch (err) {
    console.error(err);
    throw err;
  }
}