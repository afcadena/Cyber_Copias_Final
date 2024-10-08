import { useState, useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CalendarDays, TrendingUp, Plus, Trash2, BarChart2 } from 'lucide-react';
import CrudContext from '../context/CrudContextInventario'; // Importamos el CrudContext de inventario
import { useCrudContextVentas } from '../context/CrudContextVentas'; // Importamos el contexto de ventas

export default function GestionVentas() {
  const { db: productosInventario, loading: inventarioLoading } = useContext(CrudContext); // Productos de inventario
  const { db: ventas, createData, updateData, deleteData } = useCrudContextVentas(); // Ventas

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [ventaToDelete, setVentaToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('Productos Inventario:', productosInventario);
  }, [productosInventario]);

  const handleNewVenta = () => {
    setCurrentVenta(null);
    setProductos([]);
    setIsOpen(true);
  };

  const handleDeleteVenta = (venta) => {
    setVentaToDelete(venta);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (ventaToDelete) {
      deleteData(ventaToDelete.id);
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleAddProduct = () => {
    setProductos([...productos, { id: Date.now().toString(), productoId: '', cantidad: 1, precio: 0 }]);
  };

  const handleRemoveProduct = (id) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };

  const handleProductSelect = (id, productoId) => {
    const selectedProduct = productosInventario.find(prod => prod.id === productoId);
    if (selectedProduct) {
      setProductos(productos.map(producto =>
        producto.id === id
          ? { ...producto, productoId, nombre: selectedProduct.name, precio: Number(selectedProduct.price) }
          : producto
      ));
    }
  };

  const handleQuantityChange = (id, cantidad) => {
    const cantidadNumerica = Math.max(Number(cantidad), 1); // Asegurarse de que sea al menos 1

    setProductos(productos.map(producto =>
      producto.id === id ? { ...producto, cantidad: cantidadNumerica } : producto
    ));
  };

  const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
  const ventasCompletadas = ventas.filter(venta => venta.estado === 'Completada');
  const promedioVentas = ventasCompletadas.length > 0
    ? ventasCompletadas.reduce((sum, venta) => sum + venta.total, 0) / ventasCompletadas.length
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fecha = formData.get('fecha');
    const total = productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0);

    if (fecha && total > 0) {
      const ventaData = { fecha, total, productos, estado: 'Completada' };
      if (currentVenta) {
        updateData({ ...currentVenta, ...ventaData });
      } else {
        createData(ventaData);
      }
      setIsOpen(false);
      setErrorMessage(''); // Limpiar mensaje de error
    } else {
      setErrorMessage('Por favor, ingrese una fecha y al menos un producto.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart2 className="mr-2 h-8 w-8" />
          Gestión de Ventas
        </h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleNewVenta} className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Nueva Venta
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVentas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Suma de todas las ventas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Ventas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${promedioVentas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Promedio de ventas completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Venta</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ventas[ventas.length - 1]?.fecha || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Fecha de la última venta registrada</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ventas.map((venta) => (
              <TableRow key={venta.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{venta.id}</TableCell>
                <TableCell>{venta.fecha}</TableCell>
                <TableCell>${venta.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVenta(venta)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal para crear/editar ventas */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[800px] p-4 max-w-full overflow-x-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {currentVenta ? 'Editar Venta' : 'Nueva Venta'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                defaultValue={currentVenta ? currentVenta.fecha : ''}
                required
                className="mt-1 max-w-xs"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold mb-2">Productos</div>
              <div className="overflow-x-auto">
                {productos.map((producto) => (
                  <div key={producto.id} className="flex items-center mb-2">
                    <select
                      value={producto.productoId}
                      onChange={(e) => handleProductSelect(producto.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="">Seleccionar producto</option>
                      {productosInventario.map((inventario) => (
                        <option key={inventario.id} value={inventario.id}>
                          {inventario.name} - ${inventario.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      value={producto.cantidad}
                      onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                      className="ml-2 w-24"
                      min="1"
                    />
                    <span className="ml-2">${(producto.cantidad * producto.precio).toFixed(2)}</span>
                    <Button
                      type="button"
                      onClick={() => handleRemoveProduct(producto.id)}
                      className="ml-2 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={handleAddProduct}
                className="bg-blue-500 hover:bg-blue-600 text-white mt-2"
              >
                Agregar Producto
              </Button>
            </div>
            {errorMessage && (
              <div className="text-red-600 font-medium mt-2">{errorMessage}</div>
            )}
            <div className="flex justify-end mt-4">
              <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                {currentVenta ? 'Actualizar Venta' : 'Guardar Venta'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="w-[400px] p-4 max-w-full overflow-x-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="text-center mb-4">
            ¿Estás seguro de que deseas eliminar esta venta?
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </Button>
            <Button
              onClick={() => setIsConfirmDeleteOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
