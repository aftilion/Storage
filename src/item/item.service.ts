import { Injectable } from '@nestjs/common';

export class ItemService {
  async addItem(item, res, prismaService) {
    try {
      await prismaService.item.create({
        data: {
          name: item.name,
          link: item.name,
          description: item.description,
          worksUntil: item.worksUntil,
          place: item.place,
        },
      });
      res.redirect('/');
    } catch {
      res.status(404).redirect('/item/add');
    }
  }
  async removeItem(id, res, prismaService) {
    try {
      await prismaService.item.delete({
        where: {
          id: id,
        },
      });
      res.redirect('/');
    } catch {
      res.status(404);
    }
  }

  async getEditItem(id, res, user, prismaService) {
    try {
      const item = await prismaService.item.findUnique({
        where: {
          id: id,
        },
      });
      res.render('item/edit', {
        user,
        item,
      });
    } catch {
      res.status(404);
    }
  }

  async postEditItem(id, newItem, res, prismaService) {
    try {
      const item = await prismaService.item.findUnique({
        where: {
          id: id,
        },
      });
      try {
        await prismaService.item.update({
          where: {
            id: id,
          },
          data: {
            name: newItem.name ? newItem.name : item.name,
            description: newItem.description
              ? newItem.description
              : item.description,
            worksUntil: newItem.worksUntil
              ? newItem.worksUntil
              : item.worksUntil,
            place: newItem.place ? newItem.place : item.place,
          },
        });
        res.status(200).redirect('/item/edit/' + id);
      } catch {
        res.status(400).redirect('/item/edit/' + id);
      }
    } catch {
      res.status(404).redirect('/item/edit/' + id);
    }
  }
}
