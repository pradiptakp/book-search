import React, { useEffect, useState } from "react";
import Button from "./components/Button";
import { Icon } from "@iconify/react";
import axios from "axios";
import { Rating } from "react-simple-star-rating";
import { uuid } from "uuidv4";

const URL = "https://www.googleapis.com/books/v1/volumes?q=";

// Only define necessary parameters
type Book = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    averageRating: number;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
  };
};

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [wishlists, setWishlists] = useState<string[]>(
    JSON.parse(localStorage.getItem("wishlist") ?? "[]") as string[]
  );

  async function searchBook() {
    if (!searchInput) return;
    const response = await axios.get(URL + searchInput);

    if (response) {
      setBooks(response.data.items);
    } else {
      alert("ERROR");
    }
  }

  function updateWishlist(id: string, remove?: boolean) {
    let newWishlist = [...wishlists];
    if (remove) {
      newWishlist = newWishlist.filter((v) => v !== id);
    } else {
      newWishlist = [...newWishlist, id];
    }

    setWishlists(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  }

  return (
    <div className="min-h-screen max-w-screen-md px-6 w-full mx-auto">
      <div
        className={`flex flex-col justify-center items-center transition max-w-screen-sm ${
          books.length === 0 ? "h-screen" : "py-10"
        }`}
      >
        <h1 className="text-4xl font-bold mb-8">Book Search</h1>
        <div className="h-10 w-full px-4 border border-gray-300 rounded-full flex items-center mb-4">
          <Icon
            icon="mdi-light:magnify"
            height={20}
            width={20}
            className="text-gray-800"
          />
          <input
            className="flex-1 ml-4 text-sm bg-transparent"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button onClick={searchBook} text="Search" />
      </div>
      {books.length > 0 && (
        <>
          <h4 className="text-xl font-bold mb-8">Search results</h4>
          <div className="grid grid-cols-1 gap-8 mb-8">
            {books.map((book) => {
              const { authors, averageRating, imageLinks, title } =
                book.volumeInfo;
              const isInWishlist = !!wishlists.find((v) => v === book.id);

              return (
                <div className="flex">
                  <div className="w-[120px] h-[180px] mr-4 rounded-md overflow-hidden flex justify-center items-center bg-gray-200">
                    {imageLinks?.thumbnail && (
                      <img
                        alt={title}
                        src={imageLinks?.thumbnail}
                        className="object-cover h-full w-full"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col pb-4">
                    <div className="font-bold mb-1">{title}</div>
                    <div className="text-sm text-gray-600 mb-2">
                      {authors.join(", ")}
                    </div>
                    <div>
                      {averageRating && (
                        <Rating
                          initialValue={averageRating}
                          readonly
                          SVGclassName="inline-block"
                          size={20}
                        />
                      )}
                    </div>
                    <div className="flex-1" />
                    <Button
                      onClick={() => updateWishlist(book.id, isInWishlist)}
                      text={isInWishlist ? "Wishlisted" : "Wishlist"}
                      outline={isInWishlist}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
