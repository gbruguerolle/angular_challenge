import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Button } from 'primeng/button';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, Select],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  // Inputs
  totalCount = input<number>(0);
  totalPages = input<number>(0);
  pageSize = input<number>(10);
  currentPage = input<number>(1);
  
  // Outputs
  pageChange = output<number>();
  pageSizeChange = output<number>();

  // Page size options for the select dropdown
  pageSizeOptions = [10, 20, 30];

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onPageSizeChange(newPageSize: number) {
    this.pageSizeChange.emit(newPageSize);
  }
}
