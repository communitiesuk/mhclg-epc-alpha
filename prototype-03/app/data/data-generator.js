module.exports = {
  assessors (count) {
    let arr = []

    const firstNames = ['Alistair', 'Emily', 'Jake', 'Jessica', 'Katy', 'Kevin', 'Matt', 'Sudheer', 'Abi', 'Paul', 'Stephanie', 'Tom']
    const lastNames = ['Davidson', 'Hill', 'Docherty', 'Armstrong', 'Keenoy', 'Anderson', 'Edupuganti', 'Thorpe', 'Downey', 'Buck', 'Bates']
    const schemes = ['EES/', 'STRO', 'ECMK']
    const certificates = [
      {
        title: 'residential EPC',
        type: 'residential'
      }, {
        title: 'non-residential EPC',
        type: 'nonresepc'
      },
      {
        title: 'DEC',
        type: 'displayenergy'
      },
      {
        title: 'AC-CERT',
        type: 'accert'
      }
    ]

    for (let i = count - 1; i >= 0; i--) {
      const assessorCertificates = certificates.slice(0, Math.floor((Math.random() * certificates.length) + 1))
      arr.push({
        full_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        accreditation_number: `${schemes[Math.floor(Math.random() * schemes.length)]}0${Math.floor((Math.random() * 99999) + 1)}`,
        certificates: assessorCertificates,
        certificatesString: assessorCertificates.map(item => item.title).join(', '),
        distance: Math.floor((Math.random() * 20) + 1)
      })
    }

    return arr.sort((a, b) => {
      if (a.distance < b.distance) {
        return -1
      }
      if (a.distance > b.distance) {
        return 1
      }
      return 0
    })
  }
}
