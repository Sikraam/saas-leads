const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check ila email kayen déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Créer le tenant
    const tenant = await prisma.tenant.create({
      data: { name, email }
    });

    // Hash le password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'admin',
        tenantId: tenant.id
      }
    });

    // Générer JWT
    const token = jwt.sign(
      { userId: user.id, tenantId: tenant.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: { id: user.id, email: user.email, role: user.role, tenantId: tenant.id }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check ila user kayen
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer JWT
    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenantId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { register, login };