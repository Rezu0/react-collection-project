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