import sanitizeHtml from 'sanitize-html'
import { createUser, authenticate } from '@/models/users'
import { getLibrary } from '@/models/library'
import { getWishlist } from '@/models/wishlist'
import type { Request, Response } from 'express'

export const getSession = (req: Request, res: Response) => {
  res.status(200).json(req.session.user ?? null)
}

export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) console.error(err)
    res.status(200).json({ message: 'Logged out' })
  })
}

// Create a new user or authenticate an existing user. Sets the user id in the session if successful.

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    console.error('Missing email or password')
    return res.status(400).json({ message: 'Missing email or password' })
  }

  const sanitizedEmail = sanitizeHtml(email).toLowerCase()
  const sanitizedPassword = sanitizeHtml(password)

  const id = await createUser(sanitizedEmail, sanitizedPassword)

  if (!id) {
    return res.status(400).json({ message: 'Email already in use' })
  }

  req.session.user = {
    id,
    library: await getLibrary(id),
    wishlist: await getWishlist(id),
  }
  res.status(201).json(req.session.user)
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    console.error('Missing email or password')
    return res.status(400).json({ message: 'Missing email or password' })
  }

  const sanitizedEmail = sanitizeHtml(email).toLowerCase()
  const sanitizedPassword = sanitizeHtml(password)

  const id = await authenticate(sanitizedEmail, sanitizedPassword)

  if (!id) {
    return res.status(400).json({ message: 'Invalid email or password' })
  }

  req.session.user = {
    id,
    library: await getLibrary(id),
    wishlist: await getWishlist(id),
  }
  res.status(200).json(req.session.user)
}
