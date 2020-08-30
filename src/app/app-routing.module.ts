import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './guard/auth-guard.guard';
import { LogGuardGuard } from './guard2/log-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [LogGuardGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'usuario',
    loadChildren: () => import('./usuario/usuario.module').then( m => m.UsuarioPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'restaurantes',
    loadChildren: () => import('./restaurantes/restaurantes.module').then( m => m.RestaurantesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'platillos/:cveEst/:cveSuc',
    loadChildren: () => import('./platillos/platillos.module').then( m => m.PlatillosPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pedidos/pedidos.module').then( m => m.PedidosPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'carrito/:cveEst/:cveSuc',
    loadChildren: () => import('./carrito/carrito.module').then( m => m.CarritoPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'detalle-platillo/:cveEst/:cveProd/:cveSuc',
    loadChildren: () => import('./detalle-platillo/detalle-platillo.module').then( m => m.DetallePlatilloPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'seguimiento',
    loadChildren: () => import('./seguimiento/seguimiento.module').then( m => m.SeguimientoPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'detalle-pedido/:cveEst/:cvePed/:cveSuc',
    loadChildren: () => import('./detalle-pedido/detalle-pedido.module').then( m => m.DetallePedidoPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'chat/:cveEst/:cvePed/:mensajes',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
