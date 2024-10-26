import React from 'react'

const DownloadCSVButton: React.FC = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch('/api/csv/download-csv')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'data.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error('Error downloading CSV:', error)
    }
  }

  return (
    <button onClick={handleDownload} className="btn btn-primary">
      Download CSV
    </button>
  )
}

export default DownloadCSVButton
