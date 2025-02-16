import { promises as fs } from 'fs'
import path from 'path'

// Add proper typing
interface JsonData {
  [key: string]: any;
}

const DATA_DIR = path.join(process.cwd(), 'data')

export const readJSON = async (filename: string) => {
  try {
    const data = await import(`@/data/${filename}`)
    return data.default
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    throw error
  }
}

export async function appendToJSON(filename: string, data: JsonData): Promise<void> {
  const filePath = path.join(DATA_DIR, filename)
  try {
    let existingData = await readJSON(filename)
    existingData.push(data)
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2))
  } catch (error) {
    console.error(`Error appending to JSON file ${filename}:`, error)
    throw error
  }
} 