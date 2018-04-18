export interface Item {
  itemID: string;
  ownerID: string;
  title: string;
  description: string;
  price: number;
  size: number;
  licence: string;
  itemUrl: string;
  tags: string[];
  rating: number[];
  uploadedDate: number;
}
