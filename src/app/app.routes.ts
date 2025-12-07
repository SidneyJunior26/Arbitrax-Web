import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CryptoAdmComponent } from './Adm/crypto-adm/crypto-adm.component';
import { ExchangeAdmComponent } from './Adm/exchange-adm/exchange-adm.component';
import { UserAdmComponent } from './Adm/user-adm/user-adm.component';
import { ConfigOpportunityComponent } from './Adm/config-adm/config-opportunity.component';
import { OpportunityListComponent } from './Opportunities/opportunity-list/opportunity-list.component';
import { ExchangeWithdrawalFeeComponent } from './Adm/exchange-withdrawal-fee/exchange-withdrawal-fee.component';
import { LoginComponent } from './shared/login/login.component';
import { SecurityComponent } from './More/security/security.component';
import { AnalyticsComponent } from './More/analytics/analytics.component';
import { OperationsListComponent } from './Operations/operations-list/operations-list.component';
import { WhoWeAreComponent } from './shared/who-we-are/who-we-are.component';

export const routes: Routes = [
  {
    path: '',
    component: WhoWeAreComponent
  },
  {
    path: 'arbitragens',
    component: OpportunityListComponent,
    data: { title: 'Arbitragens' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'crypto-adm',
    component: CryptoAdmComponent,
    data: { title: 'Criptomoedas' },
  },
  {
    path: 'exchange-adm',
    component: ExchangeAdmComponent,
    data: { title: 'Corretoras' },
  },
  {
    path: 'exchange-withdrawal-fee',
    component: ExchangeWithdrawalFeeComponent,
    data: { title: 'Taxas de Transferência' },
  },
  {
    path: 'user-adm',
    component: UserAdmComponent,
    data: { title: 'Usuários' },
  },
  {
    path: 'config-adm',
    component: ConfigOpportunityComponent,
    data: { title: 'Configurações' },
  },
  {
    path: 'security',
    component: SecurityComponent,
    data: { title: 'Segurança' },
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    data: { title: 'Análise de Dados' },
  },
  {
    path: 'operations',
    component: OperationsListComponent,
    data: { title: 'Operações' },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
