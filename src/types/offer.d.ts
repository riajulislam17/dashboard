interface Offer {
  data: OfferData[];
  links: Links;
  meta: Meta;
}

interface OfferData {
  id: number;
  user_name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  status: string;
  type: string;
  price: number;
}

interface Links {
  first: string;
  last: string;
  prev: null;
  next: string;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}
