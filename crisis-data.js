// Emergency contacts keyed by ISO country code.
// getCrisisData(code) — falls back to INTL for unknown codes.
// Entry type field: omit for phone calls; 'sms' for text lines; 'url' for web links.
// To add a country: copy any block, change the key, update contacts.

var CRISIS_DATA = {

  ZA: {
    name: 'South Africa',
    categories: {
      mentalHealth: [
        { name: 'SADAG 24-Hour Helpline', phone: '0800 456 789', urgent: true },
        { name: 'Lifeline South Africa', phone: '0861 322 322' },
        { name: 'Suicide Crisis Line', phone: '0800 567 567' }
      ],
      gbv: [
        { name: 'GBV Command Centre', phone: '0800 428 428', urgent: true },
        { name: "People Opposing Women Abuse (POWA)", phone: '011 642 4345' }
      ],
      sexualAssault: [
        { name: 'Rape Crisis Cape Town', phone: '021 447 9762', urgent: true },
        { name: 'Thuthuzela Care Centre', phone: '10111' }
      ],
      childSafety: [
        { name: 'Childline South Africa', phone: '116', urgent: true },
        { name: 'Child Welfare South Africa', phone: '0800 435 435' }
      ],
      substance: [
        { name: 'SANCA Helpline', phone: '0861 472 622', urgent: true },
        { name: 'Narcotics Anonymous SA', phone: '083 900 6962' }
      ],
      emergency: [
        { name: 'Police', phone: '10111' },
        { name: 'Ambulance / Medical', phone: '10177' },
        { name: 'Emergency (all services)', phone: '112' }
      ]
    }
  },

  US: {
    name: 'United States',
    categories: {
      mentalHealth: [
        { name: '988 Suicide & Crisis Lifeline', phone: '988', urgent: true },
        { name: 'Crisis Text Line', phone: '741741', type: 'sms' },
        { name: 'NAMI Helpline', phone: '1-800-950-6264' }
      ],
      gbv: [
        { name: 'National DV Hotline', phone: '1-800-799-7233', urgent: true },
        { name: 'DV Text Line', phone: '88788', type: 'sms' }
      ],
      sexualAssault: [
        { name: 'RAINN Hotline', phone: '1-800-656-4673', urgent: true }
      ],
      childSafety: [
        { name: 'Childhelp National Abuse Hotline', phone: '1-800-422-4453', urgent: true },
        { name: 'Runaway & Homeless Youth', phone: '1-800-786-2929' }
      ],
      substance: [
        { name: 'SAMHSA Helpline', phone: '1-800-662-4357', urgent: true },
        { name: 'Narcotics Anonymous', phone: '1-818-773-9999' }
      ],
      emergency: [
        { name: 'Emergency (all services)', phone: '911' }
      ]
    }
  },

  GB: {
    name: 'United Kingdom',
    categories: {
      mentalHealth: [
        { name: 'Samaritans', phone: '116 123', urgent: true },
        { name: 'Mind Infoline', phone: '0300 123 3393' },
        { name: 'PAPYRUS (under 35)', phone: '0800 068 4141' }
      ],
      gbv: [
        { name: 'National DV Helpline', phone: '0808 2000 247', urgent: true },
        { name: "Men's Advice Line", phone: '0808 801 0327' }
      ],
      sexualAssault: [
        { name: 'Rape Crisis England & Wales', phone: '0808 802 9999', urgent: true },
        { name: 'Survivors UK (male survivors)', phone: '0808 800 5005' }
      ],
      childSafety: [
        { name: 'NSPCC Helpline', phone: '0808 800 5000', urgent: true },
        { name: 'Childline', phone: '0800 1111' }
      ],
      substance: [
        { name: 'FRANK Drugs Helpline', phone: '0300 123 6600', urgent: true },
        { name: 'Alcoholics Anonymous UK', phone: '0800 917 7650' }
      ],
      emergency: [
        { name: 'Emergency (all services)', phone: '999' },
        { name: 'Non-emergency police', phone: '101' }
      ]
    }
  },

  AU: {
    name: 'Australia',
    categories: {
      mentalHealth: [
        { name: 'Lifeline Australia', phone: '13 11 14', urgent: true },
        { name: 'Beyond Blue', phone: '1300 22 4636' },
        { name: 'Suicide Call Back Service', phone: '1300 659 467' }
      ],
      gbv: [
        { name: '1800RESPECT', phone: '1800 737 732', urgent: true }
      ],
      childSafety: [
        { name: 'Kids Helpline', phone: '1800 55 1800', urgent: true },
        { name: 'Child Protection Helpline', phone: '132 111' }
      ],
      substance: [
        { name: 'DirectLine (VIC)', phone: '1800 888 236', urgent: true },
        { name: 'Drug Info (NSW)', phone: '1300 85 85 84' }
      ],
      emergency: [
        { name: 'Emergency (all services)', phone: '000' },
        { name: 'Police Assistance', phone: '131 444' }
      ]
    }
  },

  NG: {
    name: 'Nigeria',
    categories: {
      mentalHealth: [
        { name: 'SURPIN Helpline', phone: '0800-500-200', urgent: true },
        { name: 'Mental Health Foundation Nigeria', phone: '+234 803 433 8420' }
      ],
      gbv: [
        { name: 'NAPTIP Hotline', phone: '0800 22 55 6284', urgent: true },
        { name: 'Project Alert Nigeria', phone: '+234 1 493 2153' }
      ],
      sexualAssault: [
        { name: 'WARIF Hotline', phone: '+234 806 000 3627', urgent: true }
      ],
      substance: [
        { name: 'NDLEA Helpline', phone: '09-2908-788', urgent: true }
      ],
      emergency: [
        { name: 'Police', phone: '199' },
        { name: 'Emergency (all services)', phone: '112' },
        { name: 'Ambulance', phone: '112' }
      ]
    }
  },

  KE: {
    name: 'Kenya',
    categories: {
      mentalHealth: [
        { name: 'Befrienders Kenya', phone: '+254 722 178 177', urgent: true },
        { name: 'Mathare Hospital Crisis Line', phone: '020 2724069' },
        { name: 'Niskize Helpline', phone: '0900 620 800' }
      ],
      gbv: [
        { name: 'GBV Recovery Centre Hotline', phone: '0800 720 990', urgent: true },
        { name: 'FIDA Kenya', phone: '+254 20 387 5522' }
      ],
      substance: [
        { name: 'NACADA Helpline', phone: '0800 723 253', urgent: true }
      ],
      emergency: [
        { name: 'Police', phone: '999' },
        { name: 'Emergency (all services)', phone: '112' },
        { name: 'Ambulance', phone: '1199' }
      ]
    }
  },

  INTL: {
    name: 'International',
    categories: {
      mentalHealth: [
        { name: 'Find A Helpline', phone: 'https://findahelpline.com', type: 'url', urgent: true },
        { name: 'IASP Crisis Centres', phone: 'https://www.iasp.info/resources/Crisis_Centres/', type: 'url' }
      ],
      emergency: [
        { name: 'Contact local emergency services', phone: '112 (works in most countries)' }
      ]
    }
  }

};

function getCrisisData(code) {
  if (!code) return CRISIS_DATA.INTL;
  var found = CRISIS_DATA[code.toUpperCase()];
  return found || CRISIS_DATA.INTL;
}
