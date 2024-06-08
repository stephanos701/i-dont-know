import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import ReactStars from 'react-rating-stars-component';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const DataFetchingComponent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6); // Número de ítems por página
  const [musica]="./audio/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://lucasyana.000webhostapp.com/api.php');
        // Añadir una propiedad de favorito a cada ítem
        const updatedData = response.data.map(item => ({ ...item, favorite: false }));
        setData(updatedData);
        setFilteredData(updatedData);
        const getMusicUrl = (audioUrl) => "../audio/" + audioUrl;

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    const lowerCaseArtistFilter = artistFilter.toLowerCase();
    const filtered = data.filter(item =>
      item.titulo.toLowerCase().includes(lowerCaseSearch) &&
      item.artista.toLowerCase().includes(lowerCaseArtistFilter)
    );
    setFilteredData(filtered);
  }, [search, artistFilter, data]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleFavoriteToggle = (index) => {
    const updatedData = [...filteredData];
    updatedData[index].favorite = !updatedData[index].favorite;
    setFilteredData(updatedData);

    const originalDataIndex = data.findIndex(item => item.titulo === updatedData[index].titulo);
    if (originalDataIndex !== -1) {
      const originalData = [...data];
      originalData[originalDataIndex].favorite = updatedData[index].favorite;
      setData(originalData);
    }
  };

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage * itemsPerPage) + itemsPerPage
  );

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

  return (
    <Container>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Data from API</h1>
      <Form style={{ marginBottom: '20px' }}>
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Buscar por Título"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="artistFilter">
          <Form.Control
            type="text"
            placeholder="Filtrar por Artista"
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Row>
        {paginatedData.map((item, index) => (
          <Col key={index} sm={12} md={6} lg={4}>
            <Card style={{ marginBottom: '20px' }}>
              <Card.Img variant="top" src={item.img} alt={item.titulo} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body style={{ padding: '20px' }}>
                <Card.Title style={{ marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>
                  {item.titulo}
                  <span
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => handleFavoriteToggle(index)}
                  >
                    {item.favorite ? <FaHeart color="red" /> : <FaRegHeart />}
                  </span>
                </Card.Title>
                <Card.Text style={{ marginBottom: '5px', fontSize: '16px' }}>{item.artista}</Card.Text>
                <Card.Text style={{ marginBottom: '5px', fontSize: '16px' }}>{item.album}</Card.Text>
                
             <Card.Text style={{ marginBottom: '5px', fontSize: '16px' }}>{item.audioUrl}</Card.Text>

                <ReactStars
                  count={5}
                  value={item.rating}
                  size={24}
                  activeColor="#ffd700"
                  edit={false}
                />
     <audio controls style={{ width: '100%', marginTop: '10px' }}>
  <source src={item.audioUrl + '.mp3'} type="audio/mpeg" />
  <source src={item.audioUrl + '.ogg'} type="audio/ogg" />
  Tu navegador no soporta la reproducción de audio.
</audio>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-center'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        activeClassName={'active'}
      />
    </Container>
  );
};

export default DataFetchingComponent;
