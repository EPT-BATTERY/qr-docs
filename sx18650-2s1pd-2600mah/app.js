(function () {
  'use strict';

  var MODEL = 'SX18650-2S1PD';
  var ADDRESS = 'Building3, Huan cheng Industrial Park, No, 41 Dalang north road, Dalang Street, Longhua District. Shenzhen CityGuangdong Province, P.R.China';
  var STORE_KEY = 'ept-qr-docs-lang';

  var manufacturerFields = [
    { l: 'lblBatteryManufacturer', v: 'Shenzhen EPT Battery Co., Ltd.' },
    { l: 'lblTrademark', v: 'EPT' },
    { l: 'lblAddress', v: ADDRESS },
    { l: 'lblEmail', v: 'info@ept-battery.com', href: 'mailto:info@ept-battery.com' },
    { l: 'lblPostal', v: '518109' },
    { l: 'lblWebsite', v: 'www.ept-battery.com', href: 'https://www.ept-battery.com' }
  ];

  var batteryFields = [
    { l: 'lblCategory', v: '@valCategory' },
    { l: 'lblProductName', v: '@valProductName' },
    { l: 'lblModel', v: MODEL, accent: true },
    { l: 'lblNominalVoltage', v: '7.4V DC' },
    { l: 'lblRatedCapacity', v: '2550mAh' },
    { l: 'lblRatedEnergy', v: '18.87Wh' },
    { l: 'lblNominalCapacity', v: '2600mAh' },
    { l: 'lblNominalEnergy', v: '19.24Wh' },
    { l: 'lblBatch', v: '@valBatch' }
  ];

  var otherFields = [
    { num: 3, l: 'lblPlace', v: '@valPlace' },
    { num: 4, l: 'lblDateMan', v: '@valDateMan' },
    { num: 5, l: 'lblWeight', v: '@valWeight' },
    { num: 6, l: 'lblCapacity', v: '2550mAh' },
    { num: 7, l: 'lblChemical', v: 'Li-ion NMC' },
    { num: 8, l: 'lblHazardous', v: '@valHazardous' },
    { num: 9, l: 'lblExtinguishing', v: '@valExtinguishing' },
    { num: 10, l: 'lblRaw', v: 'Li,Ni,Co,Mn,C,Al,Cu' },
    { num: 11, l: 'lblCodeDate', v: '@valCodeDate' }
  ];

  var snapshotFields = [
    { l: 'lblModel', v: MODEL },
    { l: 'lblNominalVoltage', v: '7.4V DC' },
    { l: 'lblRatedCapacity', v: '2550mAh' },
    { l: 'lblRatedEnergy', v: '18.87Wh' },
    { l: 'lblChemical', v: 'Li-ion NMC' },
    { l: 'lblWeight', v: '@valWeight' }
  ];

  var currentLang = 'en';

  function t(key) {
    var dict = window.I18N[currentLang] || window.I18N.en;
    return dict[key] !== undefined ? dict[key] : (window.I18N.en[key] || key);
  }

  function resolveValue(value) {
    return value.charAt(0) === '@' ? t(value.slice(1)) : value;
  }

  function makeKV(field) {
    var wrap = document.createElement('div');
    wrap.className = 'kv' + (field.accent ? ' accent' : '');

    var dt = document.createElement('dt');
    if (field.num) {
      var badge = document.createElement('span');
      badge.className = 'item-no';
      badge.textContent = field.num;
      dt.appendChild(badge);
    }
    dt.appendChild(document.createTextNode(t(field.l)));
    wrap.appendChild(dt);

    var dd = document.createElement('dd');
    if (field.href) {
      var a = document.createElement('a');
      a.href = field.href;
      if (field.href.indexOf('http') === 0) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      a.textContent = resolveValue(field.v);
      dd.appendChild(a);
    } else {
      dd.textContent = resolveValue(field.v);
    }
    wrap.appendChild(dd);
    return wrap;
  }

  function renderGrid(id, fields) {
    var node = document.getElementById(id);
    if (!node) return;
    node.textContent = '';
    fields.forEach(function (field) { node.appendChild(makeKV(field)); });
  }

  function renderSnapshot() {
    var node = document.getElementById('snapshot');
    if (!node) return;
    node.textContent = '';
    snapshotFields.forEach(function (field) {
      var row = document.createElement('div');
      var dt = document.createElement('dt');
      var dd = document.createElement('dd');
      dt.textContent = t(field.l);
      dd.textContent = resolveValue(field.v);
      row.appendChild(dt);
      row.appendChild(dd);
      node.appendChild(row);
    });
  }

  function render() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang;
    document.title = 'EPT · ' + MODEL + ' · ' + t('siteTitle');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    renderGrid('manufacturerGrid', manufacturerFields);
    renderGrid('batteryGrid', batteryFields);
    renderGrid('otherGrid', otherFields);
    renderGrid('docBatteryGrid', batteryFields);
    renderGrid('docManufacturerGrid', manufacturerFields);
    renderSnapshot();

    var select = document.getElementById('langSelect');
    if (select) select.value = currentLang;
  }

  function remember(code) {
    try { window.localStorage.setItem(STORE_KEY, code); } catch (e) { /* storage unavailable */ }
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('lang', code);
      window.history.replaceState({}, '', url.toString());
    } catch (e) { /* ignore */ }
  }

  function initialLanguage() {
    var fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl && window.I18N[fromUrl]) return fromUrl;
    var saved = null;
    try { saved = window.localStorage.getItem(STORE_KEY); } catch (e) { /* ignore */ }
    return saved && window.I18N[saved] ? saved : 'en';
  }

  function buildLanguageOptions() {
    var select = document.getElementById('langSelect');
    if (!select) return;
    window.LANGS.forEach(function (lang) {
      var option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.native + ' — ' + lang.en;
      select.appendChild(option);
    });
    select.addEventListener('change', function () {
      if (!window.I18N[select.value]) return;
      currentLang = select.value;
      remember(currentLang);
      render();
    });
  }

  function setupLightbox() {
    var box = document.getElementById('lightbox');
    var img = document.getElementById('lightboxImg');
    var close = document.getElementById('lightboxClose');
    if (!box || !img || !close) return;
    document.querySelectorAll('.zoomable').forEach(function (el) {
      el.addEventListener('click', function () {
        img.src = el.src;
        img.alt = el.alt;
        box.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function hide() {
      box.classList.remove('open');
      img.src = '';
      document.body.style.overflow = '';
    }
    close.addEventListener('click', hide);
    box.addEventListener('click', function (e) { if (e.target === box || e.target === img) hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) hide(); });
  }

  buildLanguageOptions();
  currentLang = initialLanguage();
  render();
  setupLightbox();
})();
