import { ethers } from 'ethers'
const ls = window.localStorage
import { defineDevice, getFingerprint } from './modules'
const header = document.querySelector('.header')

const servers = { 
  "key": "https://multiclaim.linkdrop.io", 
  // add key mapping to your server here
}


const getHashVariables = () => {
  const url = window.location.hash
  const onlyVariablesPart = url.split('?')[1]
  if (!onlyVariablesPart) return {}
  return onlyVariablesPart.split('&').reduce((sum, item) => {
    const variablePair = item.split('=')
    sum[variablePair[0]] = variablePair[1]
    return sum
  }, {})
}

const hashVariables = getHashVariables()


if (ls) {
  let id = ls.getItem('id')
  if (!id) {
    if (!hashVariables.id) {
      id = ethers.Wallet.createRandom().privateKey
    } else {
      id = hashVariables.id
    }
    ls.setItem('id', id)
  }

  hashVariables.id = id

  const updatedHash = Object.entries(hashVariables).map(item => `${item[0]}=${item[1]}`).join('&')
  window.location.hash = `?${updatedHash}`


  const initializeApp = async () => {
    const token = hashVariables['token']
    const fingerprint = await getFingerprint()
    const { browser, device } = defineDevice()

    if (!token) {
      header.textContent = 'No token provided in url'
      return 
    }

    const server = servers[token]
    if (!server) {
      header.textContent = 'Invalid token provided in url'
      return
    }
    fetch(`${server}/api/v1/get-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fingerprint, device, browser, device_id: id
      })
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      throw res
    })
    .then(res => {
      const { linkdropUrl } = res
      if (linkdropUrl) {
        window.location.href = linkdropUrl
      }
    })
    .catch(err => {
      err.json().then((body) => {
        const { error } = body
        header.textContent = error
      });
    })
  }

  initializeApp() 
}





