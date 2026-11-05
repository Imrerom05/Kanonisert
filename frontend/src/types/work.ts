export interface Work {
  work_id: number
  title: string
  description: string | null
  original_year: number | null
  cover_image_url: string | null
  original_language: string | null
}


export interface Author {
  author_id: number
  name: string
  birth: number | null
  death: number | null
  image_url: string | null
  description: string | null
}

export interface WorkSeries {
  series_id: number
  name: string
  position: number | null
}

export interface FullWork extends Work {
  authors: Author[]
  series: WorkSeries[]
}