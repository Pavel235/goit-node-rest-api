import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";

export async function getAllContacts(req, res, next) {
  const page = req.query.page || 1;
  const per_page = req.query.per_page || 12;
  const skip = (page - 1) * per_page;
  const favorite = req.query.favorite;

  try {
    const ownerId = { owner: req.user.id };

    let query = Contact.find(ownerId);

    if (favorite === "true") {
      query = query.where("favorite").equals(true);
    }

    const allContacts = await query.skip(skip).limit(per_page).exec();

    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
}

export async function getOneContact(req, res, next) {
  try {
    const { id } = req.params;

    const oneContact = await Contact.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!oneContact) {
      throw HttpError(404);
    }

    res.status(200).json(oneContact);
  } catch (error) {
    next(error);
  }
}

export async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;

    const contact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!contact) {
      throw new HttpError(404);
    }
    res.status(200).json(deleteContact);
  } catch (error) {
    next(error);
  }
}

export async function createContact(req, res, next) {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      owner: req.user.id,
    };
    const newContact = await Contact.create(contact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}

export async function updateContact(req, res, next) {
  try {
    const { id } = req.params;

    const result = await Contact.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.id,
      },
      req.body,
      { new: true }
    );
    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateStatusContact(req, res, next) {
  try {
    const { id } = req.params;

    const result = await Contact.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.id,
      },
      req.body,
      { new: true }
    );
    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
