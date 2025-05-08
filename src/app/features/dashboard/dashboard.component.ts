import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  investments: any[] = [];
  userId: number = 0; // Default value
  totalInvestmentValue = 0;
  totalInvestmentCost = 0;
  totalGainLoss = 0;
  totalGainLossPercentage = 0;
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
    console.log('User ID:', localStorage.getItem('userId')); // Add this to debug
    this.loadInvestments();

  }

  loadInvestments(): void {
    const userIdFromStorage = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:5154/api/investment/user/${userIdFromStorage}`).subscribe({
      next: (data) => {
        // Log data for debugging
        console.log('Fetched investments:', data);
        // this.investments = data.filter(
        //   (inv) => inv.userId === this.userId && inv.transactionType === 'buy'
        // );
        this.investments = data;

        // Log filtered investments to verify
        console.log('Filtered investments:', this.investments);

        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load investments';
        this.loading = false;
      },
    });
  }

  calculateTotals(): void {
    this.totalInvestmentCost = 0;
    this.totalInvestmentValue = 0;
    
    for (const inv of this.investments) {
      if (inv.type === 'Stock') {
        const cost = inv.purchasePrice * inv.numberOfShares;
        this.totalInvestmentCost += cost;
        const currentPrice = inv.purchasePrice * 1.05; // Dummy current price +5%
        this.totalInvestmentValue += currentPrice * inv.numberOfShares;
      } else if (inv.type === 'MutualFund') {
        const units =
          inv.amountType === 'Rupees' ? inv.amount / inv.price : inv.amount;
        const currentPrice = inv.price * 1.05;
        this.totalInvestmentCost += units * inv.price;
        this.totalInvestmentValue += units * currentPrice;
      } else if (inv.type === 'GoldBond') {
        const cost = inv.units * inv.price;
        const currentPrice = inv.price * 1.05;
        this.totalInvestmentCost += cost;
        this.totalInvestmentValue += inv.units * currentPrice;
      } else if (inv.type === 'Bond') {
        this.totalInvestmentCost += inv.investmentAmount;
        this.totalInvestmentValue += inv.investmentAmount * 1.02; // Assume 2% appreciation
      }
    }
    this.totalGainLoss = this.totalInvestmentValue - this.totalInvestmentCost;
    this.totalGainLossPercentage =
      (this.totalGainLoss / this.totalInvestmentCost) * 100;
  }

  refreshPrices(): void {
    this.loadInvestments(); // Simulate a refresh
  }

  logout(): void {
    this.authService.clearUser(); // Clear user session
    this.router.navigate(['/login']);
  }
}