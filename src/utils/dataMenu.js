export function settingsLogout() {
  return [
    {
      name: 'Profile',
      path: '/profile',
      icon: 'Person'
    },
    {
      name: 'Logout',
      path: '/logout',
      icon: 'Logout'
    },
  ];
}

export function showFormattedDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }
  
  return new Date(date).toLocaleDateString("id-ID", options)
}

export function showFormatDatatable(date) {
  const dateObject = new Date(date);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isNew(isNew) {
  switch (isNew) {
    case 1:
      return 'Yes';
    case "0":
      return 'No';
  }
}

export function showFormatDateReadable(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Jakarta' // Zona waktu WIB
  };

  const formattedDate = new Date(date).toLocaleString('id-ID', options);

  return `${formattedDate} WIB`;
}