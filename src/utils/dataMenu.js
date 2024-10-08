export function settingsLogout() {
  return [
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

export function oktWm(data) {
  switch (data) {
    case 1:
      return 'WM OKT';
    case 2:
      return 'CLEAN OKT'
    case "0":
      return 'NO WM OKT';
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

export function formatToCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatViaWithdraw(via) {
  if (via === 'DANA') {
    return {
      via: via,
      colorBtn: '#2899f3'
    }
  }

  if (via === 'GOPAY') {
    return {
      via: via,
      colorBtn: '#09ad1a'
    }
  }

  if (via === 'OVO') {
    return {
      via: via,
      colorBtn: '#543a98'
    }
  }

  return {
    via: via,
    colorBtn: '#f05333'
  }
}

export function formatDivisiStaff(divisi) {
  if (divisi === 'manhwa') {
    return {
      divisi: divisi,
      colorBtn: '#e82e37'
    }
  }

  return {
    divisi: divisi,
    colorBtn: '#1f1f1f'
  }
}

export function formatDateForHuman(dateIso) {
  const date = new Date(dateIso);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const month = Math.floor(days / 30);
  const years = Math.floor(month / 365);

  if (years > 0) {
    return years === 1 ? '1 Tahun lalu' : `${years} Tahun lalu`;
  }

  if (month > 0) {
    return month === 1 ? '1 Bulan lalu' : `${month} Bulan lalu`;
  }

  if (days > 0) {
    return days === 1 ? '1 Hari lalu' : `${days} Hari lalu`;
  }

  if (hours > 0) {
    return hours === 1 ? '1 Jam lalu' : `${hours} Jam lalu`;
  }

  if (minutes > 0) {
    return minutes === 1 ? '1 Menit lalu' : `${minutes} Menit lalu`;
  }

  return 'Just now';
}

export function calculateDoujin(lang, totalPage) {
  const doujinEng = 1000;
  const doujinJP = 1500;

  if (lang === 'eng') {
    return totalPage * doujinEng;
  }

  return totalPage * doujinJP;
}

export function calculateManhwa(lang, totalCh, isNew, clearWm) {
  const manhwaNewKor = 30000;
  const manhwaNewEng = 20000;
  const manhwaNewSpa = 25000;
  const manhwaKor = 25000;
  const manhwaEng = 15000;
  const manhwaSpa = 20000;
  const manhwaClear = 5000;
  
  if (lang === 'eng') {
    if (isNew == 1) {
      const saldo = manhwaNewEng * totalCh;
      return saldo;
    } else {
      const saldo = manhwaEng * totalCh;
      return saldo;
    }
  }

  if (lang === 'kor' || lang === 'chn') {
    if (isNew == 1 && clearWm == 2) { 
      const saldo = manhwaNewKor * totalCh + manhwaClear;
      return saldo;
    }

    if (isNew == 0 && clearWm == 2) {
      const saldo = manhwaKor * totalCh + manhwaClear;
      return saldo;
    }

    if (isNew == 1 && clearWm != 2) {
      const saldo = manhwaNewKor * totalCh;
      return saldo;
    } else {
      const saldo = manhwaKor  * totalCh;
      return saldo;
    }
  }

  if (lang === 'spa') {
    if (isNew == 1) {
      const saldo = manhwaNewSpa * totalCh;
      return saldo;
    } else {
      const saldo = manhwaSpa * totalCh;
      return saldo;
    }
  }
}

export function languageProject(lang) {
  if (lang === 'eng') {
    return 'English';
  }

  if (lang === 'kor') {
    return 'Korea';
  }

  if (lang === 'spa') {
    return 'Spain';
  }

  if (lang === 'jp') {
    return 'Japan';
  }

  return 'China';
}