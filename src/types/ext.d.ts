declare namespace RequestProgress {
  export interface ProgressState {
    // Overall percent (between 0 to 1)
    percent: number,
    // The download speed in bytes/sec
    speed: number,
    size: {
      // The total payload size in bytes
      total: number,
      // The transferred payload size in bytes
      transferred: number
    },
    time: {
      // The total elapsed seconds since the start (3 decimals)
      elapsed: string,
      // The remaining seconds to finish (3 decimals)
      remaining: string
    }
  }  
}